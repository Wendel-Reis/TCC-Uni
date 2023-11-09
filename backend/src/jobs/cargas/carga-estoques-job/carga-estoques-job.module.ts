import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { CargaEstoquesJobService } from './carga-estoques-job.service';
import { CargaEstoqueConsumer } from './cargaEstoque-consumer';
import { ProdutosModule } from '../../../modules/produtos/produtos.module';
import { LojasModule } from '../../../modules/lojas/lojas.module';
import { SharedOperationsModule } from '../../../shared/modules/shared-operations/shared-operations.module';
import { EstoquesHistoricoModule } from '../../../modules/historicos/estoques-historico/estoques-historico.module';
import { CargaDadosSocketModule } from '../../../modules/real-time/carga-dados-socket/carga-dados-socket.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'cargaEstoques-queue',
    }),
    LojasModule,
    ProdutosModule,
    SharedOperationsModule,
    EstoquesHistoricoModule,
    CargaDadosSocketModule,
  ],
  providers: [CargaEstoquesJobService, CargaEstoqueConsumer],
  exports: [CargaEstoquesJobService],
})
export class CargaEstoquesJobModule { }
