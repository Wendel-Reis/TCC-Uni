import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProdutosHistoricoService } from './produtos-historico.service';
import { ProdutosHistoricoController } from './produtos-historico.controller';
import { ProdutosHistorico } from './entities/produtos-historico.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProdutosHistorico])],
  controllers: [ProdutosHistoricoController],
  providers: [ProdutosHistoricoService],
  exports: [ProdutosHistoricoService]
})
export class ProdutosHistoricoModule { }
