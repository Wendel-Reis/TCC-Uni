import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';

import { CargaEstoquesJobService } from '../../jobs/cargas/carga-estoques-job/carga-estoques-job.service';
import { AppError } from '../../errors/AppError';
import { CargaProdutosJobService } from '../../jobs/cargas/carga-produtos-job/carga-produtos-job.service';
import { getUserIdService } from '../../shared/utils/user-utils';
import { UsersService } from '../users/users.service';
import { CargaDados } from './entities/carga-dados.entity';
import { CreateCargaDadosDto } from './dto/create-carga-dados.dto';
import { SearchCargasDto } from './dto/search-cargas.cto';
import { PageOptionsDto } from '../../shared/dtos/page/page-options.dto';
import { PageMetaDto } from '../../shared/dtos/page/page-meta.dto';
import { PageDto } from '../../shared/dtos/page/page.dto';
import { CargaDescricao, CargaNome } from '../../shared/constants/carga-tipos.constant';

@Injectable({ scope: Scope.REQUEST })
export class CargaDadosService {

    constructor(
        @Inject(REQUEST)
        private readonly request: Request,
        @InjectRepository(CargaDados)
        private readonly cargaDadosRepository: Repository<CargaDados>,
        private readonly usersService: UsersService,
        private readonly cargaProdutosJobService: CargaProdutosJobService,
        private readonly cargaEstoquesJobService: CargaEstoquesJobService,
    ) { }

    async requestCargaProdutos(file: Express.Multer.File) {
        const user_id = getUserIdService(this.request);

        if (!user_id) {
            throw new AppError(`ID do usuário logado não foi identificado`, 500);
        }

        const user = await this.usersService.findOne(user_id);
        return this.cargaProdutosJobService.cargaProdutos(file, user);
    }

    async requestCargaEstoques(file: Express.Multer.File) {
        const user_id = getUserIdService(this.request);

        if (!user_id) {
            throw new AppError(`ID do usuário logado não foi identificado`, 500);
        }

        const user = await this.usersService.findOne(user_id);
        return this.cargaEstoquesJobService.cargaEstoques(file, user);
    }

    async create(dto: CreateCargaDadosDto) {
        const cargaDados = this.cargaDadosRepository.create(dto);
        await this.cargaDadosRepository.save(cargaDados);
    }

    async search(pageDto: PageOptionsDto, searchDto: SearchCargasDto) {
        const query = this
            .cargaDadosRepository
            .createQueryBuilder("carga")
            .leftJoinAndSelect("carga.requester_user", "user")
            .orderBy("carga.created_at", pageDto.order)
            .skip(pageDto.skip)
            .take(pageDto.take)
            .where("user.id = :id", { id: searchDto.user_id });

        if (searchDto.data) {
            const data = new Date(searchDto.data.toDateString());
            query.andWhere("carga.created_at::date = :data", { data });
        }

        if (searchDto.status) {
            query.andWhere("carga.status = :status", { status: searchDto.status });
        }

        if (searchDto.nome_carga) {
            query.andWhere("carga.nome_carga = :nome_carga", { nome_carga: searchDto.nome_carga });
        }

        const [cargas, total] = await query.getManyAndCount();
        const pageMetaDto = new PageMetaDto({ itemCount: total, pageOptionsDto: pageDto });

        return new PageDto(cargas, pageMetaDto);
    }

     getCargasEnum() {
        const enumeracoes = [
            {
                nome_carga: CargaNome.CARGA_ESTOQUE,
                descricao_carga: CargaDescricao.CARGA_ESTOQUE
            },
            {
                nome_carga: CargaNome.CARGA_PRODUTOS,
                descricao_carga: CargaDescricao.CARGA_PRODUTOS
            },
        ];

        return enumeracoes;
    }

}
