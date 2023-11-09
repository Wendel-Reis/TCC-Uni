
import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Queue } from "bull";

import { User } from "../../../modules/users/entities/user.entity";
import { queuePool } from "../../../jobs/bull-board.queue";
import { BullJobsType } from "../../../shared/constants/bullJobs-type.constant";
import { Loja } from './../../../modules/lojas/entities/loja.entity';

@Injectable()
export class GenerateLojaEstoqueJobService {
    constructor(
        @InjectQueue('generateLojaEstoque-queue') private readonly queue: Queue,
    ) {
        queuePool.add(queue);
    }

    async generateLojaEstoque(loja: Loja, user: User) {
        const job_type = BullJobsType.CREATE_LOJA;
        const affected_tables = 'estoques; ';
        const requester_user = new User();
        requester_user.id = user.id;

        const attempts = process.env.MODE == 'DEV' ? 1 : 3;
        this.queue.add(
            'generateLojaEstoque-job',
            { loja, job_type, affected_tables, requester_user },
            { attempts }
        );
    }
}
