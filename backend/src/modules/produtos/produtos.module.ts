
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Produto } from './entities/produto.entity';
import { UsersModule } from '../users/users.module';
import { CaslModule } from '../../shared/authorizations/casl/casl.module';
import { ProdutosHistoricoModule } from '../historicos/produtos-historico/produtos-historico.module';
import { IsProdutoExistsConstraint } from './validations/IsProdutoExists';
import { ProdutosService } from './produtos.service';
import { ProdutosController } from './produtos.controller';
import { ProdutosRepository } from './repositories/implementations/ProdutosRepository';
import { IsUniqueNomeConstraint } from './validations/IsUniqueNome';
import { SharedUploadsModule } from './../../shared/modules/shared-uploads/shared-uploads.module';
import { SharedUploadsService } from './../../shared/modules/shared-uploads/shared-uploads.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Produto]),
    forwardRef(() => UsersModule),
    forwardRef(() => CaslModule),
    forwardRef(() => ProdutosHistoricoModule),
    forwardRef(() => SharedUploadsModule),
  ],
  controllers: [ProdutosController],
  providers: [ProdutosService, ProdutosRepository, IsUniqueNomeConstraint, IsProdutoExistsConstraint],
  exports: [ProdutosService, ProdutosRepository, IsUniqueNomeConstraint, IsProdutoExistsConstraint],
})
export class ProdutosModule { }
