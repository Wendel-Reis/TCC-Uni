
import { forwardRef, Inject } from '@nestjs/common';
import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from "@nestjs/bull";
import { STATUSES } from "@bull-board/api/dist/src/constants/statuses";
import { Job } from "bull";
import { validate } from 'uuid';

import { Loja } from './../../../modules/lojas/entities/loja.entity';
import { BullJobName } from "../../../shared/constants/bullJobs-type.constant";
import { SpecifiedLojaEstoqueDto } from "../dto/specified-loja-estoque.dto";
import { SharedOperationsService } from '../../../shared/modules/shared-operations/shared-operations.service';
import { SharedService } from './../../../shared/modules/shared.service';

@Processor('specifiedLojaEstoque-queue')
export class SpecifiedLojaEstoqueConsumer {

    job_name = BullJobName.CREATE_LOJA;

    constructor(
        private readonly sharedServices: SharedService,
        private readonly sharedOperationsService: SharedOperationsService,
    ) { }

    @Process('specifiedLojaEstoque-job')
    async specifiedLojaEstoqueJob(job: Job<SpecifiedLojaEstoqueDto>) {
        job.log(`Iniciando o JOB: "${this.job_name}"`);
        job.log(`JOB do tipo: ${job.data.job_type}`);
        const { data } = job;
        const { loja, requester_user, produtos } = data;
        job.log(`Usuário solicitante da carga: ${requester_user.nome} (${requester_user.id})`);

        try {
            const loja_id = loja.id;
            job.log(`*** Loja ***`);
            job.log(`Nome: ${loja.nome}`);
            job.log(`Código: ${loja.codigo}`);
            job.log(`ID: ${loja_id}`);
            job.log(`******`);
            job.log(`Listando produtos cadastrados`);

            job.log(`Iniciando FOR`);
            for (const p of produtos) {

                if (!validate(p.produto_id)) {
                    job.log(`Produto ${p.produto_id} está com um UUID inválido!`);
                    job.log(`Seguindo para o próximo produto`);
                    job.log(``);
                    continue;
                }

                let produto;

                try {
                    produto = await this.sharedServices.findOneProduto(p.produto_id);
                } catch (e) { }

                if (!produto) {
                    job.log(`Produto ${p.produto_id} não encontrado`);
                    job.log(`Seguindo para o próximo produto`);
                    job.log(``);
                    continue;
                }

                job.log(`Produto "${produto.nome}" encontrado`);
                job.log(`Criando estoque de ${produto.nome} na loja`);

                await this.sharedOperationsService.createEstoque({
                    loja_id,
                    produto_id: produto.id,
                }, requester_user, p.quant_entrada);

                job.log(`Estoque do produto ${produto.nome} foi criado com sucesso!`);
                job.log(``);
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