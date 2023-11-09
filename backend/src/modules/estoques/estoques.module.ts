import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EstoquesService } from './estoques.service';
import { EstoquesController } from './estoques.controller';
import { CaslModule } from '../../shared/authorizations/casl/casl.module';
import { SharedOperationsModule } from '../../shared/modules/shared-operations/shared-operations.module';
import { UsersModule } from '../users/users.module';
import { Estoque } from './entities/estoque.entity';
import { LojasModule } from '../lojas/lojas.module';

@Module({
  imports: [TypeOrmModule.forFeature([Estoque]), SharedOperationsModule, CaslModule, UsersModule, LojasModule],
  controllers: [EstoquesController],
  providers: [EstoquesService],
  exports: [EstoquesService]
})
export class EstoquesModule { }
