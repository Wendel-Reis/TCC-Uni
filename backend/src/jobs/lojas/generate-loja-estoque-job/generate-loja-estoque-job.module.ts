

import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { SharedOperationsModule } from '../../../shared/modules/shared-operations/shared-operations.module';
import { GenerateLojaEstoqueJobService } from './generate-loja-estoque-job.service';
import { GenerateLojaEstoqueConsumer } from './generateLojaEstoque-consumer';
import { SharedModule } from './../../../shared/modules/shared.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'generateLojaEstoque-queue',
    }),
    SharedModule,
    SharedOperationsModule,
  ],
  providers: [GenerateLojaEstoqueJobService, GenerateLojaEstoqueConsumer],
  exports: [GenerateLojaEstoqueJobService],
})
export class GenerateLojaEstoqueJobModule {}
