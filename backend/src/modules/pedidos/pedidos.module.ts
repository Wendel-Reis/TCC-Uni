
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';
import { Pedido } from './entities/pedido.entity';
import { UsersModule } from '../users/users.module';
import { CaslModule } from '../../shared/authorizations/casl/casl.module';
import { ProdutosModule } from '../produtos/produtos.module';
import { LojasModule } from './../lojas/lojas.module';
import { EstoquesModule } from './../estoques/estoques.module';
import { ItemPedido } from './entities/item-pedido.entity';
import { PedidosRepository } from './repositories/implementations/PedidosRepository';
import { PDVController } from './pdv.controller';
import { PdvService } from './pdv.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pedido, ItemPedido]),
    CaslModule,
  forwardRef(() => EstoquesModule),
  forwardRef(() => LojasModule),
  forwardRef(() => ProdutosModule),
  forwardRef(() => UsersModule)
  ],
  controllers: [PedidosController, PDVController],
  providers: [PedidosService, PedidosRepository, PdvService]
})
export class PedidosModule { }
