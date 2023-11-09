
import { forwardRef, Inject } from '@nestjs/common';
import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from "@nestjs/bull";
import { STATUSES } from "@bull-board/api/dist/src/constants/statuses";
import { Job } from "bull";

import { GenerateLojaEstoqueDto } from "../dto/generate-loja-estoque.dto";
import { BullJobName } from "../../../shared/constants/bullJobs-type.constant";
import { SharedOperationsService } from '../../../shared/modules/shared-operations/shared-operations.service';
import { SharedService } from './../../../shared/modules/shared.service';

@Processor('generateLojaEstoque-queue')
export class GenerateLojaEstoqueConsumer {

    job_name = BullJobName.CREATE_LOJA;

    constructor(
        private readonly sharedServices: SharedService,
        private readonly sharedOperationsService: SharedOperationsService,
    ) { }
    // FINALIZAR
    @Process('generateLojaEstoque-job')
    async generateLojaEstoqueJob(job: Job<GenerateLojaEstoqueDto>) {
        job.log(`Iniciando o JOB: "${this.job_name}"`);
        job.log(`JOB do tipo: ${job.data.job_type}`);
        const { data } = job;
        const { loja, requester_user } = data;
        job.log(`Usuário solicitante da carga: ${requester_user.nome} (${requester_user.id})`);

        try {
            const loja_id = loja.id;
            job.log(`*** Loja ***`);
            job.log(`Nome: ${loja.nome}`);
            job.log(`Código: ${loja.codigo}`);
            job.log(`ID: ${loja_id}`);
            job.log(`******`);
            job.log(`Listando produtos cadastrados`);
            const [produtos, quantidade] = await this.sharedServices.listAllProdutos();
            job.log(`Quantidade de produtos cadastrados: ${quantidade}`);

            job.log(`Iniciando FOR`);
            for (const produto of produtos) {
                const produto_id = produto.id;
                job.log(`Criando estoque de ${produto.nome}`);
                await this.sharedOperationsService.createEstoque({
                    loja_id,
                    produto_id,
                }, requester_user);
                job.log(`Estoque do produto ${produto.nome} foi criado com sucesso!`);
            }
        } catch (e) {
            await job.discard()
            job.log(`Erro no job ${e.message}`);
            job.log(e.stack);
            await job.moveToFailed({ message: e.message }, true);
        }
        job.log(`Finalizando o JOB: "${this.job_name}"`);
    }
}