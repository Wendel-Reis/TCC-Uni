import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

import { BullJobsType } from '../../../shared/constants/bullJobs-type.constant';
import { queuePool } from '../../../jobs/bull-board.queue';
import { User } from '../../../modules/users/entities/user.entity';

@Injectable()
export class CargaEstoquesJobService {
    constructor(@InjectQueue('cargaEstoques-queue') private queue: Queue) {
        queuePool.add(queue);
    }

    async cargaEstoques(file: Express.Multer.File, user: User) {
        const job_type = BullJobsType.LOADER;
        const affected_tables = 'estoques; ';
        const requester_user = new User();
        requester_user.id = user.id;

        const attempts = process.env.MODE == 'DEV' ? 1 : 3;
        const { path } = file;

        this.queue.add(
            'cargaEstoques-job',
            { user, filePath: path, job_type, affected_tables, requester_user },
            { attempts }
        );
    }
}
