import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EstoquesHistoricoService } from './estoques-historico.service';
import { EstoquesHistoricoController } from './estoques-historico.controller';
import { EstoqueHistorico } from './entities/estoques-historico.entity';
import { CaslModule } from '../../../shared/authorizations/casl/casl.module';

@Module({
  imports: [TypeOrmModule.forFeature([EstoqueHistorico]), CaslModule],
  controllers: [EstoquesHistoricoController],
  providers: [EstoquesHistoricoService],
  exports: [EstoquesHistoricoService],
})
export class EstoquesHistoricoModule { }
