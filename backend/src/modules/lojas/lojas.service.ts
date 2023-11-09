import { FilterLojaDto } from './dto/filter-loja.dto';

import {  forwardRef, Inject, Injectable, Scope} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { instanceToPlain, plainToClass } from 'class-transformer';

import { PageMetaDto } from '../../shared/dtos/page/page-meta.dto';
import { PageOptionsDto } from '../../shared/dtos/page/page-options.dto';
import { PageDto } from '../../shared/dtos/page/page.dto';
import { AppError } from '../../errors/AppError';
import { CreateLojaDto } from './dto/create-loja.dto';
import { UpdateLojaDto } from './dto/update-loja.dto';
import { LojasRepository } from './repositories/implementations/LojasRepository';
import { Loja } from './entities/loja.entity';
import { UsersService } from '../users/users.service';
import { getUserIdService } from '../../shared/utils/user-utils';
import { CreateEnderecoDto } from '../enderecos/dto/create-endereco.dto';
import { Endereco } from '../enderecos/entities/endereco.entity';
import { EstoqueMode } from '../../shared/constants/estoque.constant';
import { GenerateLojaEstoqueJobService } from './../../jobs/lojas/generate-loja-estoque-job/generate-loja-estoque-job.service';
import { SpecifiedLojaEstoqueJobService } from './../../jobs/lojas/specified-loja-estoque-job/specified-loja-estoque-job.service';

@Injectable({ scope: Scope.REQUEST })
export class LojasService {

  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
    @InjectRepository(Endereco)
    private readonly enderecosRepository: Repository<Endereco>,
    private readonly lojaRepository: LojasRepository,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly generateLojaEstoqueJobService: GenerateLojaEstoqueJobService,
    private readonly specifiedLojaEstoqueJobService: SpecifiedLojaEstoqueJobService,
  ) { }

  async create(dto: CreateLojaDto, user_registrou_id?: string) {

    if (dto.estoque_mode == EstoqueMode.SPECIFIED && (!dto.produtos || dto.produtos.length <= 0)) {
      throw new AppError(`O campo 'produtos' é obrigatório quando o modo de criação de estoque for 'ESPECIFICADO'`);
    }

    const user_id = user_registrou_id ? user_registrou_id : getUserIdService(this.request);
    const user = await this.usersService.findOne(user_id);

    const loja = this.lojaRepository.create(dto);
    loja.user_registrou = user;
    const createdLoja = await this.lojaRepository.save(loja);

    switch (dto.estoque_mode) {
      case EstoqueMode.GENERATE:
        this.generateLojaEstoqueJobService.generateLojaEstoque(createdLoja, user);
        break;
      case EstoqueMode.SPECIFIED:
        this.specifiedLojaEstoqueJobService.specifiedLojaEstoque(createdLoja, user, dto.produtos);
        break;
    }

    return plainToClass(Loja, createdLoja);
  }

  async findAll(pageOptionsDto: PageOptionsDto, filterDto: FilterLojaDto) {
    const [lojas, total] = await this.lojaRepository.list(pageOptionsDto, filterDto);

    const pageMetaDto = new PageMetaDto({ itemCount: total, pageOptionsDto });

    return new PageDto(lojas, pageMetaDto);
  }

  async listAllRestrictedById(ids: string[]) {
    const lojas = await this.lojaRepository.listRestrictedById(ids);

    return lojas;
  }

  async findOne(id: string) {
    const lojaExists = await this.checkIfLojaExists(id);
    return instanceToPlain(lojaExists, { groups: ['find'] }) as Loja;
  }

  async update(id: string, dto: UpdateLojaDto) {
    await this.checkIfLojaExists(id);
    const updatedLoja = await this.lojaRepository.save(dto);
    return plainToClass(Loja, updatedLoja);
  }

  async updateForced(loja: Loja){
    console.log(loja);
    const updatedLoja = await this.lojaRepository.save(loja);
    return updatedLoja;
  }

  async createLojaEndereco(id: any, dto: CreateEnderecoDto) {
    const endereco = this.enderecosRepository.create(dto);
    const loja = await this.checkIfLojaExists(id);

    if (loja.endereco) {
      endereco.id = loja.endereco.id;
    }

    loja.endereco = endereco;
    const updatedLoja = await this.lojaRepository.save(loja);
    return plainToClass(Loja, updatedLoja);
  }


  async remove(id: string) {
    await this.checkIfLojaExists(id);

    await this.lojaRepository.softDelete({ id });
  }

  private async checkIfLojaExists(id: string): Promise<Loja> {
    const lojaExists = await this.lojaRepository.findById(id);

    if (!lojaExists) {
      throw new AppError(`Loja ${id} não encontrado!`, 404);
    }

    return lojaExists;
  }
}
