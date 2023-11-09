import * as fs from "fs";
import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from "@nestjs/bull";
import { STATUSES } from "@bull-board/api/dist/src/constants/statuses";
import { parse } from 'csv-parse';
import { Job } from "bull";

import { CargaProdutoDto, CargaProdutoRequestDto } from "../dto/carga-produto.dto";
import { ProdutosRepository } from "../../../modules/produtos/repositories/implementations/ProdutosRepository";
import { AcaoCarga } from "../../../shared/constants/carga-acao.constant";
import { OperationType } from "../../../shared/constants/operation-types.constant";
import { CreateProdutosHistoricoDto } from "../../../modules/historicos/produtos-historico/dto/create-produtos-historico.dto";
import { ProdutosHistoricoService } from "../../../modules/historicos/produtos-historico/produtos-historico.service";
import { CargaDadosSocketGateway } from "../../../modules/real-time/carga-dados-socket/carga-dados-socket.gateway";
import { BasicCargaNotificationDto } from "../../../modules/real-time/carga-dados-socket/dto/carga-notification.dto";
import { CargaDescricao, CargaNome } from "../../../shared/constants/carga-tipos.constant";
import { SharedOperationsService } from "../../../shared/modules/shared-operations/shared-operations.service";
import { CargaStatus } from "../../../shared/constants/cargta-status.constant";


@Processor('cargaProdutos-queue')
export class CargaProdutoConsumer {

    carga_nome = CargaNome.CARGA_PRODUTOS;
    descricao_carga = CargaDescricao.CARGA_PRODUTOS;

    constructor(
        private readonly produtosRepository: ProdutosRepository,
        private readonly produtosHistoricoService: ProdutosHistoricoService,
        private readonly cargaDadosSocketGateway: CargaDadosSocketGateway,
        private readonly sharedOperationsService: SharedOperationsService,
    ) { }

    @Process('cargaProdutos-job')
    async cargaProdutosJob(job: Job<CargaProdutoRequestDto>) {
        job.log(`Iniciando o JOB: "${this.carga_nome}"`);
        job.log(`JOB do tipo: ${job.data.job_type}`);
        const { data } = job;
        const { user, filePath } = data;
        const tipo = OperationType.LOADER
        job.log(`Usuário solicitante da carga: ${user.nome} (${user.id})`);
        job.log(`Trabalhando com o arquivo: ${filePath}`);

        await new Promise(resolve => {
            setTimeout(resolve, 3000);
        });

        try {
            const produtos = await this.loadProdutos(filePath, job) as CargaProdutoDto[];
            const historicoProdutos: CreateProdutosHistoricoDto[] = [];
            const cargaDados = await this.sharedOperationsService.findCargaByJob(job);
            job.log(`Iniciando carga no banco de dados`);

            for (const produto of produtos) {
                const { nome, descricao, preco_compra, preco_venda } = produto;
                const existProduto = await this.produtosRepository.findByNome(nome);

                if (!existProduto) {
                    job.log(`O produto ${nome} ainda NÃO EXISTE, portanto será criado`);
                    const newProduto = this.produtosRepository.create({ nome, descricao, preco_compra, preco_venda, user_registrou: user });
                    const createdProduto = await this.produtosRepository.save(newProduto);
                    job.log(`O produto ${nome} foi CRIADO com sucesso!`);
                    historicoProdutos.push({
                        requester_user: user,
                        tipo,
                        produto: createdProduto,
                        preco_compra_atual: null,
                        preco_compra_atualizado: createdProduto.preco_compra,
                        preco_venda_atual: null,
                        preco_venda_atualizado: createdProduto.preco_venda,
                        status: AcaoCarga.CREATE,
                        carga: cargaDados,
                    });
                } else {
                    job.log(`O produto ${nome} EXISTE, portanto será atualizado`);
                    const preco_compra_atual = existProduto.preco_compra;
                    const preco_venda_atual = existProduto.preco_venda;
                    existProduto.descricao = descricao || existProduto.descricao;
                    existProduto.preco_compra = preco_compra || preco_compra_atual;
                    existProduto.preco_venda = preco_venda || preco_venda_atual;
                    existProduto.user_registrou = user;
                    const updatedProduto = await this.produtosRepository.save(existProduto);
                    job.log(`O produto ${nome} foi ATUALIZADO com sucesso!`);
                    historicoProdutos.push({
                        requester_user: user,
                        tipo,
                        produto: updatedProduto,
                        preco_compra_atual,
                        preco_compra_atualizado: updatedProduto.preco_compra,
                        preco_venda_atual,
                        preco_venda_atualizado: updatedProduto.preco_venda,
                        status: AcaoCarga.UPDATED,
                        carga: cargaDados,
                    });
                }
            };

            job.log(`Inserindo histórico na tabela`);
            await this.produtosHistoricoService.createAll(historicoProdutos);
            job.log(`Histórico inserido`);
        } catch (e) {
            await job.discard()
            job.log(`Erro no job ${e.message}`);
            job.log(e.stack);
            await job.moveToFailed({ message: e.message }, true);
        }
        job.log(`Finalizando o JOB: "${this.carga_nome}"`);
    }

    @OnQueueActive()
    async handleStart(job: Job) {
        await this.sharedOperationsService.createCarga({
            requester_user: job.data.user,
            job_id: job.id.toString(),
            nome_carga: this.carga_nome,
            descricao_carga: this.descricao_carga,
            nome_job: job.name,
            status: CargaStatus.EM_EXECUCAO,
            tabelas_afetadas: job.data.affected_tables,
        });

        const message = `Oi ${job.data.user.nome}, a sua "${this.carga_nome}" acabou de começar`;
        const notification: BasicCargaNotificationDto = {
            carga_nome: this.carga_nome,
            job_id: job.id.toString(),
            status: STATUSES.active,
            user: job.data.user,
            message,
        }
        this.cargaDadosSocketGateway.cargaNotification(notification);
    }

    @OnQueueCompleted()
    async handleSucess(job: Job, result: any) {
        const cargaDados = await this.sharedOperationsService.findCargaByJob(job);
        const message = `Oi ${job.data.user.nome}, a sua "${this.carga_nome}" acabou de finalizar`;
        const notification: BasicCargaNotificationDto = {
            carga_nome: this.carga_nome,
            job_id: job.id.toString(),
            status: STATUSES.completed,
            user: job.data.user,
            message,
        }
        cargaDados.status = CargaStatus.CONCLUIDO;
        await this.sharedOperationsService.updateCarga(cargaDados);
        this.cargaDadosSocketGateway.finishNotification(notification);
    }

    @OnQueueFailed()
    async handleFailed(job: Job, err: Error) {
        const cargaDados = await this.sharedOperationsService.findCargaByJob(job);
        const message = `Oi ${job.data.user.nome}, infelizmente a sua "${this.carga_nome}" falhou`;
        const notification: BasicCargaNotificationDto = {
            carga_nome: this.carga_nome,
            job_id: job.id.toString(),
            status: STATUSES.failed,
            user: job.data.user,
            message,
        }
        cargaDados.status = CargaStatus.FALHA;
        cargaDados.error_descricao = job.failedReason;
        await this.sharedOperationsService.updateCarga(cargaDados);
        this.cargaDadosSocketGateway.finishNotification(notification);
    }

    private async loadProdutos(filePath: string, job: Job<CargaProdutoRequestDto>) {
        return new Promise((resolve, reject) => {
            const stream = fs.createReadStream(filePath);
            job.log(`Realizando parse do CSV.`);
            job.log(`Delimitador: ","`);
            job.log(`Partindo da linha 2 (por causa do Header)`);
            const parseFile = parse({
                delimiter: ",",
                from_line: 2, //Para não pegar o Header do CSV
            });

            const produtos: CargaProdutoDto[] = [];

            stream.pipe(parseFile);
            let linhaCount = 0;
            job.log(`Iniciando leitura`);
            parseFile
                .on("data", async (line) => {
                    linhaCount++;
                    job.log(`Linha ${linhaCount}: ${line}`);
                    const [nome, descricao, preco_compra, preco_venda] = line;
                    produtos.push({
                        nome,
                        descricao,
                        preco_compra: Number(preco_compra.replace(',', '.')),
                        preco_venda: Number(preco_venda.replace(',', '.'))
                    });
                })
                .on("end", () => {
                    job.log(`Leitura finalizada`);
                    job.log(`Deletando arquivo ${filePath} `);
                    fs.promises.unlink(filePath);
                    resolve(produtos);
                })
                .on("error", (err) => {
                    job.log(`Erro durante a leitura: ${err.name}`);
                    job.log(err.message);
                    reject(err);
                });
        });
    }

} 