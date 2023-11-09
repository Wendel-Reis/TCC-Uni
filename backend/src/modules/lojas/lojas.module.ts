

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LojasService } from './lojas.service';
import { LojasController } from './lojas.controller';
import { Loja } from './entities/loja.entity';
import { LojasRepository } from './repositories/implementations/LojasRepository';
import { User } from '../users/entities/user.entity';
import { Endereco } from '../enderecos/entities/endereco.entity';
import { UsersModule } from '../users/users.module';
import { IsUniqueCodigoConstraint } from './validations/IsUniqueCodigo';
import { IsUniqueNomeConstraint } from './validations/IsUniqueNome';
import { CaslModule } from '../../shared/authorizations/casl/casl.module';
import { GenerateLojaEstoqueJobModule } from './../../jobs/lojas/generate-loja-estoque-job/generate-loja-estoque-job.module';
import { SpecifiedLojaEstoqueJobModule } from './../../jobs/lojas/specified-loja-estoque-job/specified-loja-estoque-job.module';

@Module({
  imports: [TypeOrmModule.forFeature([Loja, User, Endereco]),  forwardRef(() => UsersModule), 
  CaslModule, GenerateLojaEstoqueJobModule, SpecifiedLojaEstoqueJobModule ],
  controllers: [LojasController],
  providers: [LojasService, LojasRepository, IsUniqueCodigoConstraint, IsUniqueNomeConstraint],
  exports: [LojasService, LojasRepository],
})
export class LojasModule { }
