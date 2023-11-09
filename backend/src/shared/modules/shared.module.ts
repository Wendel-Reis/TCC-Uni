import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Loja } from '../../modules/lojas/entities/loja.entity';
import { LojasRepository } from '../../modules/lojas/repositories/implementations/LojasRepository';
import { PerfisRepository } from '../../modules/perfis/repositories/implementations/PerfisRepository';
import { Perfil } from '../../modules/perfis/entities/perfil.entity';
import { SharedService } from './shared.service';
import { Produto } from '../../modules/produtos/entities/produto.entity';
import { ProdutosRepository } from '../../modules/produtos/repositories/implementations/ProdutosRepository';
import { Notificacao } from '../../modules/notificacoes/entities/notificacoe.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Loja, Perfil, Produto, Notificacao]),],
  providers: [
    SharedService, LojasRepository, PerfisRepository, ProdutosRepository,
  ],
  exports: [SharedService]
})
export class SharedModule { }
