import { client_pefil_id } from './../../../../shared/constants/system.constant';
import { Injectable } from "@nestjs/common";
import { PageOptionsDto } from "../../../../shared/dtos/page/page-options.dto";
import { DataSource, Repository } from "typeorm";
import { Perfil } from "../../entities/perfil.entity";
import { IPerfisRepository } from "../IPerfisRepository";
import { SearchPerfilDto } from "../../dto/search-perfil.dto";

@Injectable()
class PerfisRepository extends Repository<Perfil> implements IPerfisRepository {

  constructor(private dataSource: DataSource) {
    super(Perfil, dataSource.createEntityManager());
  }

  async findById(id: string): Promise<Perfil> {
    const perfil = await this
      .createQueryBuilder("perfil")
      .where("perfil.id = :id", { id })
      .getOne();
    return perfil;
  }

  async list(
    { skip, take, order }: PageOptionsDto,
    { with_cliente }: SearchPerfilDto
  ): Promise<[Perfil[], number]> {
    const query = this
      .createQueryBuilder("perfil")
      .orderBy("perfil.created_at", order)
      .skip(skip)
      .take(take);

    if (with_cliente === "false") {
      query.where(`perfil.id != :client_pefil_id`, { client_pefil_id })
    }

    query.andWhere(`perfil.id NOT IN (:...ids)`, { ids: ['7c38b234-5c4f-490b-9a31-37f39813bd5a', '46ab9369-cb84-463c-8cb4-6662bc35300b'] })

    const perfis = await query.getManyAndCount();

    return perfis;
  }

  async findByNome(nome: string): Promise<Perfil> {
    const perfil = await this.findOne({ where: { nome } });
    return perfil;
  }
}

export { PerfisRepository };
