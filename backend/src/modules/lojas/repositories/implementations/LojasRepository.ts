
import { Injectable } from "@nestjs/common";
import { PageOptionsDto } from "../../../../shared/dtos/page/page-options.dto";
import { DataSource, Repository, ILike, In, Brackets } from "typeorm";
import { validate } from "uuid";
import { Loja } from "../../entities/loja.entity";

import { ILojasRepository } from "../ILojasRepository";
import { FilterLojaDto } from "../../dto/filter-loja.dto";
import { loja_admin_id } from './../../../../shared/constants/system.constant';

@Injectable()
export class LojasRepository extends Repository<Loja> implements ILojasRepository {

  constructor(private dataSource: DataSource) {
    super(Loja, dataSource.createEntityManager());
  }

  async findByIdOrNomeOrCodigo(idOrNomeOrCodigo: string): Promise<Loja> {
    const isUUID = validate(idOrNomeOrCodigo);

    const query = this
      .createQueryBuilder("loja")
      .leftJoinAndSelect("loja.user_registrou", "users")
      .leftJoinAndSelect("loja.endereco", "endereco")
      .leftJoinAndSelect("loja.estoques", "estoque")
      .leftJoinAndSelect("estoque.produto", "produto")

    if (isUUID) {
      query.where("loja.id = :id", { id: idOrNomeOrCodigo })
    } else {
      query
        .where("loja.nome ILIKE :nome", { nome: `${idOrNomeOrCodigo}` })
        .orWhere("loja.codigo ILIKE :codigo", { codigo: `${idOrNomeOrCodigo}` })
    }

    const loja = await query.getOne();

    return loja;
  }

  async findById(id: string): Promise<Loja> {
    const loja = await this
      .createQueryBuilder("loja")
      .leftJoinAndSelect("loja.user_registrou", "users")
      .leftJoinAndSelect("loja.endereco", "endereco")
      .leftJoinAndSelect("loja.estoques", "estoque")
      .leftJoinAndSelect("estoque.produto", "produto")
      .where("loja.id = :id", { id })
      .getOne();
    return loja;
  }
  async findByCodigo(codigo: string): Promise<Loja> {
    const loja = await this
      .createQueryBuilder("loja")
      .leftJoinAndSelect("loja.user_registrou", "users")
      .leftJoinAndSelect("loja.endereco", "endereco")
      .leftJoinAndSelect("loja.estoques", "estoque")
      .leftJoinAndSelect("estoque.produto", "produto")
      .where("Loja.codigo = :codigo", { codigo })
      .getOne();
    return loja;
  }

  async findByNome(nome: string): Promise<Loja> {
    const loja = await this
      .createQueryBuilder("loja")
      .leftJoinAndSelect("loja.user_registrou", "users")
      .leftJoinAndSelect("loja.endereco", "endereco")
      .leftJoinAndSelect("loja.estoques", "estoque")
      .leftJoinAndSelect("estoque.produto", "produto")
      .where("loja.nome ILIKE :nome", { nome })
      .getOne();

    return loja;
  }

  async list({ skip, take, order }: PageOptionsDto,
    { descricao, nome, searchedLoja, codigo }: FilterLojaDto): Promise<[Loja[], number]> {
    const query = await this
      .createQueryBuilder("loja")
      .leftJoinAndSelect("loja.user_registrou", "users")
      .leftJoinAndSelect("loja.endereco", "endereco")
      .leftJoinAndSelect("loja.estoques", "estoque")
      .leftJoinAndSelect("estoque.produto", "produto")
      .orderBy("loja.created_at", order)
      .skip(skip)
      .take(take);

    if (searchedLoja) {
      query.andWhere(new Brackets(qb => {
        qb.where("loja.nome ILIKE :nome OR loja.descricao ILIKE :descricao OR loja.codigo ILIKE :codigo", {
          nome: `%${searchedLoja}%`,
          descricao: `%${searchedLoja}%`,
          codigo: `%${searchedLoja}%`,
        });
      }));
    }

    if (nome) {
      query.andWhere("loja.nome LIKE :nome", { nome: `%${nome}%` });
    }

    if (descricao) {
      query.andWhere("loja.descricao LIKE :descricao", { descricao: `%${descricao}%` });
    }

    if (codigo) {
      query.andWhere("loja.codigo = :codigo", { codigo });
    }

    query.andWhere("loja.id != :loja_admin_id", { loja_admin_id });

    const lojas = await query.getManyAndCount();

    return lojas;
  }

  async listRestrictedById(ids: string[]): Promise<[Loja[], number]> {
    const query = this
      .createQueryBuilder("loja");

    if (ids && ids.length > 0) {
      query.where('loja.id not in (:...ids )', { ids })
    }

    const lojas = await query.getManyAndCount();
    return lojas;
  }
}
