import { TipoCash, TipoTransacao } from './../../shared/constants/transacao.constant';
import { forwardRef, Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

import { CreatePedidoDto } from './dto/create-pedido.dto';
import { AppError } from './../../errors/AppError';
import { UsersService } from '../users/users.service';
import { ProdutosService } from '../produtos/produtos.service';
import { LojasService } from '../lojas/lojas.service';
import { EstoquesService } from '../estoques/estoques.service';
import { StatusPedido } from '../../shared/constants/status-pedido.constant';
import { PedidoDto } from './dto/pedido.dto';
import { PedidosRepository } from './repositories/implementations/PedidosRepository';
import { Pedido } from './entities/pedido.entity';
import { ItemProdutoDto } from './dto/item-produto.dto';
import { SearchPedidoDto } from './dto/search-pedido.dto';
import { PageDto } from './../../shared/dtos/page/page.dto';
import { PageMetaDto } from './../../shared/dtos/page/page-meta.dto';
import { PageOptionsDto } from '../../shared/dtos/page/page-options.dto';
import { Estoque } from '../estoques/entities/estoque.entity';
import { ItemPedido } from './entities/item-pedido.entity';
import { SuperPageMetaDto } from './../../shared/dtos/super-page/super-page-meta.dto';
import { SuperPageOptionsDto } from './../../shared/dtos/super-page/super-page-options.dto';

@Injectable({ scope: Scope.REQUEST })
export class PedidosService {

  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
    @Inject(forwardRef(() => ProdutosService))
    private readonly produtosService: ProdutosService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => LojasService))
    private readonly lojasService: LojasService,
    @Inject(forwardRef(() => EstoquesService))
    private readonly estoquesService: EstoquesService,
    private readonly pedidoRepository: PedidosRepository,
  ) { }

  async create(dto: CreatePedidoDto) {
    const { valor_desconto, valor_acrescimo, percentual_acrescimo, percentual_desconto, cliente_id, vendedor_id, loja_id } = dto;
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
    const { pedido, estoques } = await this.doCalculation(dto);

    pedido.cliente = cliente;
    pedido.vendedor = vendedor;
    pedido.loja = loja;

    const createdPedido = this.pedidoRepository.create(pedido);
    return await this.pedidoRepository.manager.transaction(async (transactionalEntityManager) => {
      const pedido = await transactionalEntityManager.save(createdPedido);
      await transactionalEntityManager.save(estoques);

      return pedido
    });

  }

  async findAll(superPageOptionsDto: SuperPageOptionsDto, filterDto: SearchPedidoDto) {
    const [pedidos, total] = await this.pedidoRepository.list(superPageOptionsDto, filterDto);

    const pageMetaDto = new SuperPageMetaDto({ itemCount: total, superPageOptionsDto });

    return new PageDto(pedidos, pageMetaDto);
  }

  async findOne(id: string) {
    const pedidoExists = await this.checkIfPedidoExists(id);

    return pedidoExists;
  }

  async solicitarCancelamento(id: string) {
    const pedido = await this.checkIfPedidoExists(id);

    pedido.status_pedido = StatusPedido.CANCELAMENTO_SOLICITADO;
    await this.pedidoRepository.save(pedido);
  }

  async cancelar(id: string,) {
    const pedido = await this.checkIfPedidoExists(id, true);
    const { status_pedido } = pedido;

    if (status_pedido == StatusPedido.CANCELADO) {
      throw new AppError(`O pedido ${id} já está cancelado`);
    }

    if (status_pedido != StatusPedido.CANCELAMENTO_SOLICITADO) {
      throw new AppError(`O pedido ${id} está ${status_pedido}, portanto não é possível cancelar.
      Apenas pedidos com o status ${StatusPedido.CANCELAMENTO_SOLICITADO} podem ser efetivamente cancelados`);
    }
    pedido.status_pedido = StatusPedido.CANCELADO;

    const { id: loja_id } = pedido.loja;
    const { itens_produto } = pedido;
    const estoques: Estoque[] = [];

    this.pedidoRepository.manager.transaction(async (transactionalEntityManager) => {
      await this.pedidoRepository.save(pedido);
      for (const i of itens_produto) {
        const { quantidade, produto } = i;
        const estoque = await this.estoquesService.findEstoqueByLojaAndProduto(loja_id, produto.id);
        estoque.quantidade = Number(estoque.quantidade) + Number(quantidade);
        estoques.push(estoque);
        await transactionalEntityManager.softDelete(ItemPedido, { id: i.id });
      }

      await transactionalEntityManager.save(estoques);
      await this.pedidoRepository.softDelete({ id });
    });

  }

  async faturar(id: string) {
    const pedido = await this.checkIfPedidoExists(id, true);
    const { status_pedido } = pedido;

    if (status_pedido == StatusPedido.CANCELAMENTO_SOLICITADO) {
      throw new AppError(`Foi solicitado o cancelamento do pedido ${id}`);
    }

    if (status_pedido == StatusPedido.CANCELADO) {
      throw new AppError(`O pedido ${id} já está cancelado`);
    }
    await this.doFaturacao(pedido);
    pedido.status_pedido = StatusPedido.FATURADO;
    return await this.pedidoRepository.save(pedido);
  }

  async finalizar(id: string) {
    const pedido = await this.checkIfPedidoExists(id, true);
    const { status_pedido } = pedido;

    if (status_pedido == StatusPedido.FATURADO) {
      throw new AppError(`O pedido ${id} ainda não foi faturado, portanto não pode ser finalizado`);
    }

    pedido.status_pedido = StatusPedido.FINALIZADO;
    return await this.pedidoRepository.save(pedido);
  }

  async doCalculation(dto: CreatePedidoDto) {
    const { valor_desconto, valor_acrescimo, percentual_acrescimo, percentual_desconto, item_produto, loja_id } = dto;
    const itens: ItemProdutoDto[] = [];
    const messages = []; // const error: AppError = {message: [], statusCode: 400};
    const estoques: Estoque[] = [];
    let total = 0;
    for (const i of item_produto) {
      try {
        const estoque = await this.estoquesService.checkEstoque(loja_id, i);
        const { quantidade } = i;
        const { produto } = estoque;
        const sub_total = Number(produto.preco_venda) * Number(quantidade);
        total += Number(sub_total);

        itens.push({
          produto,
          quantidade,
          valor_unitario: Number(produto.preco_venda),
          sub_total,
        });

        estoque.quantidade -= quantidade;
        estoques.push(estoque);

      } catch (e) {
        const { message } = e;
        messages.push(message);
      }
    }

    if (messages.length >= 1) {
      throw new AppError(messages);
    }

    let aux = 0;
    let valor_variavel = 0;
    let total_devido = Number(total);
    if (valor_desconto) {
      aux++;
      valor_variavel = Number(valor_desconto * -1);
      total_devido += Number(valor_variavel);
    }

    if (valor_acrescimo) {
      aux++;
      valor_variavel = Number(valor_acrescimo);
      total_devido += Number(valor_variavel);
    }

    if (percentual_acrescimo) {
      aux++;
      valor_variavel = Number((total * (percentual_acrescimo / 100)));
      total_devido += Number(valor_variavel);
    }

    if (percentual_desconto) {
      aux++;
      valor_variavel = Number((total * (percentual_desconto / 100)) * -1);
      total_devido += Number(valor_variavel);
    }

    if (aux > 1) {
      throw new AppError(`Dois ou mais campos de desconto/acréscimo está preenchido.
      Por favor, utilize apenas uma opção.`, 422);
    }

    const { descricao, pagamento_forma, } = dto;
    const pedido: PedidoDto = {
      descricao, pagamento_forma,
      itens_produto: itens,
      total_pedido: Number(total),
      total_devido,
      acrescimo_desconto: Number(valor_variavel),
      status_pedido: StatusPedido.CRIADO,
      id: undefined,
      cliente: undefined,
      loja: undefined,
      vendedor: undefined,
    }
    return {
      pedido,
      estoques,
    };
  }

  async doFaturacao(pedido: Pedido) {
    //TODO - Integracao para gerar N.F;
    let quantidade = 0;
    pedido.itens_produto.forEach(i => {
      quantidade = Number(quantidade) + Number(i.quantidade);
    });

  }

  private async checkIfPedidoExists(id: string, canceled = false): Promise<Pedido> {
    const pedidoExists = await this.pedidoRepository.findById(id);

    if (!pedidoExists) {
      throw new AppError(`Pedido ${id} não encontrado!`, 404);
    }

    return pedidoExists;
  }
}
