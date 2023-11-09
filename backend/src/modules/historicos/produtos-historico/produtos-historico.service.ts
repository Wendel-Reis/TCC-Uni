import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProdutosHistoricoDto } from './dto/create-produtos-historico.dto';
import { ProdutosHistorico } from './entities/produtos-historico.entity';

@Injectable()
export class ProdutosHistoricoService {

  constructor(
    @InjectRepository(ProdutosHistorico)
    private readonly produtosHistoricoRepository: Repository<ProdutosHistorico>,
  ) { }

  async create(dto: CreateProdutosHistoricoDto) {
    const historico = this.produtosHistoricoRepository.create(dto);
    return await this.produtosHistoricoRepository.save(historico);
  }

  async createAll(dtos: CreateProdutosHistoricoDto[]) {
    const historicos = this.produtosHistoricoRepository.create(dtos);
    return await this.produtosHistoricoRepository.save(historicos);
  }

  async findByCargaId(carga_id: string) {
    const historico = await this.produtosHistoricoRepository
      .createQueryBuilder('ph')
      .leftJoin('ph.carga', 'c')
      .leftJoinAndSelect('ph.produto', 'p')
      .where('c.id = :id', { id: carga_id })
      .getMany();

    return historico;
  }
}
