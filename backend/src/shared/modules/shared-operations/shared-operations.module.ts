import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedOperationsService } from './shared-operations.service';
import { SharedModule } from '../shared.module';
import { Estoque } from '../../../modules/estoques/entities/estoque.entity';
import { EstoquesHistoricoModule } from '../../../modules/historicos/estoques-historico/estoques-historico.module';
import { CargaDados } from '../../../modules/carga-dados/entities/carga-dados.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Estoque, CargaDados]), SharedModule, EstoquesHistoricoModule],
  providers: [SharedOperationsService],
  exports: [SharedOperationsService]
})
export class SharedOperationsModule { }
