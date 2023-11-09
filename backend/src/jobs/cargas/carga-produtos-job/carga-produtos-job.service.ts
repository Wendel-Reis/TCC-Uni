import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Queue } from "bull";

import { User } from "../../../modules/users/entities/user.entity";
import { queuePool } from "../../../jobs/bull-board.queue";
import { BullJobsType } from "../../../shared/constants/bullJobs-type.constant";

@Injectable()
export class CargaProdutosJobService {
    constructor(
        @InjectQueue('cargaProdutos-queue') private readonly queue: Queue,
        ) {
        queuePool.add(queue);
    }

    async cargaProdutos(file: Express.Multer.File, user: User) {
        const job_type = BullJobsType.LOADER;
        const affected_tables = 'produtos; ';
        const requester_user = new User();
        requester_user.id = user.id;

        const attempts = process.env.MODE == 'DEV' ? 1 : 3;
        const { path } = file;
        this.queue.add(
            'cargaProdutos-job',
            { user, filePath: path, job_type, affected_tables, requester_user },
            { attempts}
        ); 
    }
}
