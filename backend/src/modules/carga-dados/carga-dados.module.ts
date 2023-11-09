import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';

import { CargaDadosService } from './carga-dados.service';
import { CargaDadosController } from './carga-dados.controller';
import { CargaDados } from './entities/carga-dados.entity';
import { CargaProdutosJobModule } from '../../jobs/cargas/carga-produtos-job/carga-produtos-job.module';
import { UsersModule } from '../users/users.module';
import { CargaEstoquesJobModule } from '../../jobs/cargas/carga-estoques-job/carga-estoques-job.module';
import { FolderPathEnum } from '../../shared/constants/folder-path.constant';

@Module({
  imports: [
    TypeOrmModule.forFeature([CargaDados]),
    MulterModule.register({
      dest: FolderPathEnum.CARGA_DADOS
    }),
    UsersModule,
    CargaProdutosJobModule,
    CargaEstoquesJobModule,
  ],
  controllers: [CargaDadosController],
  providers: [CargaDadosService]
})
export class CargaDadosModule { }
