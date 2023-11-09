
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { SharedOperationsModule } from '../../../shared/modules/shared-operations/shared-operations.module';
import { SharedModule } from './../../../shared/modules/shared.module';
import { SpecifiedLojaEstoqueJobService } from './specified-loja-estoque-job.service';
import { SpecifiedLojaEstoqueConsumer } from './specifiedLojaEstoque-consumer';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'specifiedLojaEstoque-queue',
    }),
    SharedModule,
    SharedOperationsModule,
  ],
  providers: [SpecifiedLojaEstoqueJobService, SpecifiedLojaEstoqueConsumer],
  exports: [SpecifiedLojaEstoqueJobService],
})
export class SpecifiedLojaEstoqueJobModule {}
