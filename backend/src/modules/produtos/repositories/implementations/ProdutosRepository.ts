import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { validate } from "uuid";

import { PageOptionsDto } from "../../../../shared/dtos/page/page-options.dto";
import { FilterProdutoDto } from "../../dto/filter-produto.dto";
import { Produto } from "../../entities/produto.entity";
import { IProdutosRepository } from "../IProdutosRepository";

@Injectable()
export class ProdutosRepository extends Repository<Produto> implements IProdutosRepository {

  constructor(private dataSource: DataSource) {
    super(Produto, dataSource.createEntityManager());
  }

  async findByIdOrNome(idOrNome: string): Promise<Produto> {
    const isUUID = validate(idOrNome);

    const query = this
      .createQueryBuilder("produto")
      .leftJoinAndSelect("produto.user_registrou", "users")
      .leftJoinAndSelect("produto.estoques", "estoque")
      .leftJoinAndSelect("estoque.loja", "loja");

    if (isUUID) {
      query.where("produto.id = :id", { id: idOrNome })
    }else{
      query.where("produto.nome ILIKE :nome", { nome: `${idOrNome}` })
    }

    const produto = await query.getOne();

    return produto;
  }

  async findById(id: string): Promise<Produto> {
    const produto = await this
      .createQueryBuilder("produto")
      .leftJoinAndSelect("produto.user_registrou", "users")
      .leftJoinAndSelect("produto.estoques", "estoque")
      .leftJoinAndSelect("estoque.loja", "loja")
      .where("produto.id = :id", { id })
      .getOne();
    return produto;
  }


  async findByNome(nome: string): Promise<Produto> {
    const produto = await this
      .createQueryBuilder("produto")
      .leftJoinAndSelect("produto.user_registrou", "users")
      .leftJoinAndSelect("produto.estoques", "estoque")
      .leftJoinAndSelect("estoque.loja", "loja")
      .where("produto.nome ILIKE :nome", { nome })
      .getOne();
    return produto;
  }

  async list(pageOptions: PageOptionsDto,
    filterOptions: FilterProdutoDto): Promise<[Produto[], number]> {
    const { skip, take, order } = pageOptions;
    const { descricao, nome } = filterOptions;
    const query = this
      .createQueryBuilder("produto")
      .leftJoinAndSelect("produto.estoques", "estoque")
      .leftJoinAndSelect("estoque.loja", "loja")
      .orderBy("produto.created_at", order)
      .skip(skip)
      .take(take)
      .where("1=1");

    if (nome) {
      query.andWhere("produto.nome ILIKE :nome", { nome: `%${nome}%` });
    }

    if (descricao) {
      query.andWhere("produto.descricao ILIKE :descricao", { descricao: `%${descricao}%` });
    }

    const produtos = await query.getManyAndCount();

    return produtos;
  }


  async listAll(): Promise<[Produto[], number]> {
    
    const query = this
      .createQueryBuilder("produto");

    const produtos = await query.getManyAndCount();

    return produtos;
  }
}
