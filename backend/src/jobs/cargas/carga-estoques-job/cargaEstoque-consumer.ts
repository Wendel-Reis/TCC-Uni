import * as fs from "fs";
import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from "@nestjs/bull";
import { parse } from 'csv-parse';
import { Job } from "bull";
import { STATUSES } from "@bull-board/api/dist/src/constants/statuses";

import { CargaEstoqueDto, CargaEstoqueRequestDto, } from "../dto/carga-estoque.dto";
import { AcaoCarga } from "../../../shared/constants/carga-acao.constant";
import { ProdutosRepository } from "../../../modules/produtos/repositories/implementations/ProdutosRepository";
import { LojasRepository } from "../../../modules/lojas/repositories/implementations/LojasRepository";
import { SharedOperationsService } from "../../../shared/modules/shared-operations/shared-operations.service";
import { EstoquesHistoricoService } from "../../../modules/historicos/estoques-historico/estoques-historico.service";
import { OperationType } from "../../../shared/constants/operation-types.constant";
import { CreateEstoquesHistoricoDto } from "../../../modules/historicos/estoques-historico/dto/create-estoques-historico.dto";
import { CargaDescricao, CargaNome } from "../../../shared/constants/carga-tipos.constant";
import { CargaStatus } from "../../../shared/constants/cargta-status.constant";
import { BasicCargaNotificationDto } from "../../../modules/real-time/carga-dados-socket/dto/carga-notification.dto";
import { CargaDadosSocketGateway } from "../../../modules/real-time/carga-dados-socket/carga-dados-socket.gateway";


@Processor('cargaEstoques-queue')
export class CargaEstoqueConsumer {

    carga_nome = CargaNome.CARGA_ESTOQUE;
    descricao_carga = CargaDescricao.CARGA_ESTOQUE;

    constructor(
        private readonly produtosRepository: ProdutosRepository,
        private readonly lojasRepository: LojasRepository,
        private readonly sharedOperationsService: SharedOperationsService,
        private readonly estoquesHistoricoService: EstoquesHistoricoService,
        private readonly cargaDadosSocketGateway: CargaDadosSocketGateway,
    ) { }

    @Process('cargaEstoques-job')
    async cargaEstoquesJob(job: Job<CargaEstoqueRequestDto>) {
        job.log(`Iniciando o JOB: "carga de estoques"`);
        job.log(`JOB do tipo: ${job.data.job_type}`);
        const { data } = job;
        const { user, filePath } = data;
        const tipo = OperationType.LOADER
        job.log(`Usuário solicitante da carga: ${user.nome} (${user.id})`);
        job.log(`Trabalhando com o arquivo: ${filePath}`);

        try {
            const estoques = await this.loadEstoques(filePath, job) as CargaEstoqueDto[];
            const historicoEstoque: CreateEstoquesHistoricoDto[] = [];
            const cargaDados = await this.sharedOperationsService.findCargaByJob(job);
            job.log(`Iniciando carga no banco de dados`);

            for (const estoque of estoques) {
                const { loja, produto, quantidade } = estoque;

                let errorValidacao = false;
                let acao = AcaoCarga.FAIL;
                let erro_descricao = '';

                const produtoExists = await this.produtosRepository.findByIdOrNome(produto);
                if (!produtoExists) {
                    erro_descricao = erro_descricao.concat(`O Produto ${produto} NÃO EXISTE.; `);
                    job.log(`O Produto ${produto} NÃO EXISTE.`);
                    errorValidacao = true;
                }

                const lojaExists = await this.lojasRepository.findByIdOrNomeOrCodigo(loja);
                if (!lojaExists) {
                    erro_descricao = erro_descricao.concat(`A loja ${loja} NÃO EXISTE.; `);
                    job.log(`A loja ${loja} NÃO EXISTE.`);

                    errorValidacao = true;
                }

                if (errorValidacao) {
                    historicoEstoque.push({
                        loja_carga: loja,
                        produto_carga: produto,
                        erro_descricao,
                        tipo,
                        requester_user: user,
                        status: acao,
                        carga: cargaDados
                    });
                    job.log(`Pulando para o próximo...`);
                    continue;
                }

                const operatedEstoque = await this.sharedOperationsService
                    .findEstoqueByProdutoAndLoja(lojaExists.id, produtoExists.id);
                job.log(`Estoque atual do produto "${produtoExists.nome}" na loja "${lojaExists.nome}": ${operatedEstoque.quantidade}`);
                operatedEstoque.loja = lojaExists;
                operatedEstoque.produto = produtoExists;

                const quantidade_momento = operatedEstoque.quantidade;
                if (quantidade >= 0) {
                    job.log(`O estoque será ACRESCIDO em: ${quantidade}`);
                    acao = AcaoCarga.UP;
                    operatedEstoque.quantidade = Number(operatedEstoque.quantidade) + Number(quantidade);
                } else {
                    job.log(`O estoque será REDUZIDO em: ${quantidade}`);
                    acao = AcaoCarga.DOWN;
                    operatedEstoque.quantidade = Number(operatedEstoque.quantidade) - Number(quantidade);
                }

                const updatedEstoque = await this.sharedOperationsService.updateEstoque(operatedEstoque);
                historicoEstoque.push({
                    loja: lojaExists,
                    produto: produtoExists,
                    erro_descricao: null,
                    tipo,
                    requester_user: user,
                    status: acao,
                    quantidade_alterada: quantidade,
                    quantidade_momento: quantidade_momento,
                    quantidade_atualizada: operatedEstoque.quantidade,
                    carga: cargaDados
                });
                job.log(`Estoque atual do produto "${produtoExists.nome}" na loja "${lojaExists.nome}": ${updatedEstoque.quantidade_atualizada}`);

            };

            job.log(`Inserindo histórico na tabela`);
            await this.estoquesHistoricoService.createAll(historicoEstoque);
            job.log(`Histórico inserido`);
        } catch (e) {
            await job.discard()
            job.log(`Erro no job ${e.message}`);
            job.log(e.stack);
            await job.moveToFailed({ message: e.message }, true);
        }


        //job.log(`${importedEstoques.toString()}`); - SALVAR CARGAS no BD
        job.log(`Finalizando o JOB: "carga de estoques"`);
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
            status: STATUSES.completed,
            user: job.data.user,
            message,
        }
        cargaDados.status = CargaStatus.FALHA;
        cargaDados.error_descricao = job.failedReason;
        await this.sharedOperationsService.updateCarga(cargaDados);
        this.cargaDadosSocketGateway.finishNotification(notification);
    }

    private async loadEstoques(filePath: string, job: Job<CargaEstoqueRequestDto>) {

        return new Promise((resolve, reject) => {
            const stream = fs.createReadStream(filePath);

            try {
                job.log(`Verificando se o arquivo "${filePath}" existe`);
                fs.statSync(filePath);
            } catch (e) {

                job.log(`Falha na leitura do arquivo "${filePath}"`);
                throw e;
            }
            job.log(`Realizando parse do CSV.`);
            job.log(`Delimitador: ","`);
            job.log(`Partindo da linha 2 (por causa do Header)`);
            const parseFile = parse({
                delimiter: ",",
                from_line: 2, //Para não pegar o Header do CSV
            });
            const estoques: CargaEstoqueDto[] = [];

            stream.pipe(parseFile);
            let linhaCount = 0;
            job.log(`Iniciando leitura`);
            parseFile
                .on("data", async (line) => {
                    linhaCount++;
                    job.log(`Linha ${linhaCount}: ${line}`);
                    const [loja, produto, quantidade] = line;
                    estoques.push({
                        loja,
                        produto,
                        quantidade: Number(quantidade.replace(',', '.')),
                    });
                })
                .on("end", () => {
                    job.log(`Leitura finalizada`);
                    job.log(`Deletando arquivo ${filePath} `);
                    fs.promises.unlink(filePath);
                    resolve(estoques);
                })
                .on("error", (err) => {
                    job.log(`Erro durante a leitura: ${err.name}`);
                    job.log(err.message);
                    reject(err);
                })


        });
    }
}