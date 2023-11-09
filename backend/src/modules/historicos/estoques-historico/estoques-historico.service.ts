import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateEstoquesHistoricoDto } from './dto/create-estoques-historico.dto';
import { EstoqueHistorico } from './entities/estoques-historico.entity';

@Injectable()
export class EstoquesHistoricoService {

  constructor(
    @InjectRepository(EstoqueHistorico)
    private readonly estoqueHistoricoRepository: Repository<EstoqueHistorico>,
  ) { }

  async create(dto: CreateEstoquesHistoricoDto) {
    const historico = this.estoqueHistoricoRepository.create(dto);
    return await this.estoqueHistoricoRepository.save(historico);
  }

  async createAll(dtos: CreateEstoquesHistoricoDto[]) {
    const historicos = this.estoqueHistoricoRepository.create(dtos);
    return await this.estoqueHistoricoRepository.save(historicos);
  }

  async findByCargaId(carga_id: string) {
    const historico = await this.estoqueHistoricoRepository
      .createQueryBuilder('e')
      .leftJoin('e.carga', 'c')
      .leftJoinAndSelect('e.produto', 'p')
      .leftJoinAndSelect('e.loja', 'l')
      .where('c.id = :id', { id: carga_id })
      .getMany();

    return historico;
  }
}
