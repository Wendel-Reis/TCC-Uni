

import { forwardRef, Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

import { CreatePedidoDto } from './dto/create-pedido.dto';
import { AppError } from '../../errors/AppError';
import { UsersService } from '../users/users.service';
import { ProdutosService } from '../produtos/produtos.service';
import { LojasService } from '../lojas/lojas.service';
import { StatusPedido } from '../../shared/constants/status-pedido.constant';
import { PedidosRepository } from './repositories/implementations/PedidosRepository';
import { PedidosService } from './pedidos.service';
import { cliente_nao_cadastrado_id } from './../../shared/constants/system.constant';

@Injectable({ scope: Scope.REQUEST })
export class PdvService {

  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
    @Inject(forwardRef(() => ProdutosService))
    private readonly produtosService: ProdutosService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => LojasService))
    private readonly lojasService: LojasService,
    private readonly pedidosService: PedidosService,
    private readonly pedidoRepository: PedidosRepository,
  ) { }

  async create(dto: CreatePedidoDto) {
    const { valor_desconto, valor_acrescimo, percentual_acrescimo, percentual_desconto,  vendedor_id, loja_id } = dto;
    const cliente_id = cliente_nao_cadastrado_id;

    let aux = 0;
    if (valor_desconto) {
      aux++;
    }

    if (valor_acrescimo) {
      aux++;
    }

    if (percentual_acrescimo) {
      aux++;
    }

    if (percentual_desconto) {
      aux++;
    }

    if (aux > 1) {
      throw new AppError(`Dois ou mais campos de desconto/acréscimo está preenchido.
      Por favor, utilize apenas uma opção.`, 422);
    }

    if (aux == 1 && !dto.descricao) {
      throw new AppError(`A descrição do motivo do desconto/acréscimo é obrigatória!`, 422);
    }

    const cliente = await this.usersService.findOne(cliente_id);
    const vendedor = await this.usersService.findOne(vendedor_id);

    const loja = loja_id ? await this.lojasService.findOne(loja_id) : vendedor.loja;
    dto.loja_id = loja.id;
    const { pedido, estoques } = await this.pedidosService.doCalculation(dto);
    pedido.cliente = cliente;
    pedido.vendedor = vendedor;
    pedido.loja = loja;

    const createdPedido = this.pedidoRepository.create(pedido);
    createdPedido.from_pdv = true;
    createdPedido.status_pedido = StatusPedido.CRIADO;

    const newPedido = await this.pedidoRepository.save(createdPedido);
    newPedido.status_pedido = StatusPedido.FINALIZADO;
    return await this.pedidoRepository.manager.transaction(async (transactionalEntityManager) => {
      const pedido = await transactionalEntityManager.save(newPedido);
      await this.pedidosService.doFaturacao(pedido);
      await transactionalEntityManager.save(estoques);

      return pedido
    });
  }

}
