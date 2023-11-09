import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { CargaProdutosJobService } from './carga-produtos-job.service';
import { CargaProdutoConsumer } from './cargaProduto-consumer';
import { ProdutosModule } from '../../../modules/produtos/produtos.module';
import { ProdutosHistoricoModule } from '../../../modules/historicos/produtos-historico/produtos-historico.module';
import { CargaDadosSocketModule } from '../../../modules/real-time/carga-dados-socket/carga-dados-socket.module';
import { SharedOperationsModule } from '../../../shared/modules/shared-operations/shared-operations.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'cargaProdutos-queue',
    }),
    ProdutosModule,
    ProdutosHistoricoModule,
    CargaDadosSocketModule,
    SharedOperationsModule,
  ],
  providers: [CargaProdutosJobService, CargaProdutoConsumer],
  exports: [CargaProdutosJobService],
})
export class CargaProdutosJobModule { }
