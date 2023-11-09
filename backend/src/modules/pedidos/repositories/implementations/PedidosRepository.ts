
import { Injectable } from "@nestjs/common";

import { StatusPedido } from "../../../../shared/constants/status-pedido.constant";
import { DataSource, Repository, ILike, Brackets } from "typeorm";
import { PageOptionsDto } from "../../../../shared/dtos/page/page-options.dto";
import { Pedido } from "../../entities/pedido.entity";
import { IPedidosRepository } from "../IPedidosRepository";
import { SearchPedidoDto } from './../../dto/search-pedido.dto';
import { LocalPedidoEnum } from "../../../../shared/constants/local-pedido.constant";


@Injectable()
class PedidosRepository extends Repository<Pedido> implements IPedidosRepository {

    constructor(private dataSource: DataSource) {
        super(Pedido, dataSource.createEntityManager());
    }

    async findById(id: string, canceled = false): Promise<Pedido> {
        const query = await this
            .createQueryBuilder("pedido")
            .leftJoinAndSelect("pedido.cliente", "cliente")
            .leftJoinAndSelect("pedido.vendedor", "vendedor")
            .leftJoinAndSelect("pedido.loja", "loja")
            .leftJoinAndSelect("pedido.itens_produto", "itens_produto")
            .leftJoinAndSelect("itens_produto.produto", "produto")
            .where("pedido.id = :id", { id });

        if (canceled) {
            query.withDeleted();
        }

        return query.getOne();
    }

    async list(
        { skip, take, order }: PageOptionsDto,
        {
            cliente_id, status_pedido, vendedor_id, acrescimo_desconto, loja_id, pagamento_forma, local,
            searchedCliente, searchedVendedor, searchedLoja, searchedPedido, min_total, max_total, created_at
        }: SearchPedidoDto
    ): Promise<[Pedido[], number]> {

        const query = this
            .createQueryBuilder("pedido")
            .leftJoinAndSelect("pedido.cliente", "cliente")
            .leftJoinAndSelect("pedido.vendedor", "vendedor")
            .leftJoinAndSelect("pedido.loja", "loja")
            .leftJoinAndSelect("pedido.itens_produto", "itens_produto")
            .leftJoinAndSelect("itens_produto.produto", "produto")
            .orderBy("pedido.created_at", order)
            .skip(skip)
            .take(take)
            .where("1=1");

        if (cliente_id) {
            query.andWhere("cliente.id = :id", { id: cliente_id });
        }

        if (vendedor_id) {
            query.andWhere("vendedor.id = :id", { id: vendedor_id });
        }

        if (loja_id) {
            query.andWhere("loja.id = :id", { id: loja_id });
        }

        if (searchedPedido) {
            query.andWhere(new Brackets(qb => {
                qb.where("pedido.id::text ILIKE :pedido_id", {
                    pedido_id: `%${searchedPedido}%`,
                });
            }));
        }

        if (searchedCliente) {
            query.andWhere(new Brackets(qb => {
                qb.where("cliente.nome ILIKE :cliente_nome or cliente.email ILIKE :cliente_email or cliente.cpf ILIKE :cliente_cpf", {
                    cliente_nome: `%${searchedCliente}%`,
                    cliente_email: `%${searchedCliente}%`,
                    cliente_cpf: `%${searchedCliente}%`,
                });
            }));
        }

        if (searchedVendedor) {
            query.andWhere(new Brackets(qb => {
                qb.where("vendedor.nome ILIKE :vendedor_nome or vendedor.email ILIKE :vendedor_email or vendedor.cpf ILIKE :vendedor_cpf", {
                    vendedor_nome: `%${searchedVendedor}%`,
                    vendedor_email: `%${searchedVendedor}%`,
                    vendedor_cpf: `%${searchedVendedor}%`,
                });
            }));
        }

        if (searchedLoja) {
            query.andWhere(new Brackets(qb => {
                qb.where("loja.nome ILIKE :loja_nome or loja.descricao ILIKE :loja_descricao or loja.codigo ILIKE :loja_codigo", {
                    loja_nome: `%${searchedLoja}%`,
                    loja_descricao: `%${searchedLoja}%`,
                    loja_codigo: `%${searchedLoja}%`,
                });
            }));
        }

        if (vendedor_id) {
            query.andWhere("vendedor.id = :id", { id: vendedor_id });
        }

        if (loja_id) {
            query.andWhere("loja.id = :id", { id: loja_id });
        }

        if (status_pedido) {
            query.andWhere("pedido.status_pedido = :status_pedido", { status_pedido });
            if (status_pedido == StatusPedido.CANCELADO) {
                query.withDeleted();
            }
        }

        if (acrescimo_desconto) {
            query.andWhere("pedido.acrescimo_desconto = :acrescimo_desconto", { acrescimo_desconto });
        }

        if (pagamento_forma) {
            query.andWhere("pedido.pagamento_forma = :pagamento_forma", { pagamento_forma });
        }

        if (local) {
            const from_pdv = local == LocalPedidoEnum.PDV ? true : false;
            query.andWhere("pedido.from_pdv = :from_pdv", { from_pdv });
        }

        if (min_total) {
            query.andWhere("pedido.total_pedido >= :min_total", { min_total });
        }

        if (max_total) {
            query.andWhere("pedido.total_pedido <= :max_total", { max_total });
        }
        
        if (created_at) {
            query.andWhere("pedido.created_at::date = :created_at", { created_at: new Date(created_at) });
        }
        
        const pedidos = await query.getManyAndCount();
        return pedidos;
    }

}

export { PedidosRepository };
