
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Brackets } from 'typeorm';

import { EntradaEstoqueDto } from './dto/entrada-estoque.dto';
import { QuantidadeEstoqueResponseDto } from './dto/quantidade-estoque-response.dto';
import { UsersService } from '../users/users.service';
import { SharedOperationsService } from '../../shared/modules/shared-operations/shared-operations.service';
import { getUserIdService } from '../../shared/utils/user-utils';
import { AppError } from '../../errors/AppError';
import { SaidaEstoqueDto } from './dto/saida-estoque.dto';
import { Estoque } from './entities/estoque.entity';
import { LojasService } from '../lojas/lojas.service';
import { CreateEstoqueDto } from './dto/create-estoque.dto';
import { CreateItemProdutoDto } from '../pedidos/dto/create-item-produto.dto';
import { PageDto } from './../../shared/dtos/page/page.dto';
import { PageMetaDto } from './../../shared/dtos/page/page-meta.dto';
import { PageOptionsDto } from './../../shared/dtos/page/page-options.dto';
import { FilterProdutoDto } from '../produtos/dto/filter-produto.dto';

@Injectable({ scope: Scope.REQUEST })
export class EstoquesService {

    constructor(
        @Inject(REQUEST)
        private readonly request: Request,
        @InjectRepository(Estoque)
        private readonly estoquesRepository: Repository<Estoque>,
        private readonly usersService: UsersService,
        private readonly sharedOperationsService: SharedOperationsService,
        private readonly lojasService: LojasService,
    ) { }


    async createEstoque(dto: CreateEstoqueDto): Promise<QuantidadeEstoqueResponseDto> {
        const user_id = getUserIdService(this.request);
        if (!user_id) {
            throw new AppError(`ID do usuário logado não foi identificado`, 500);
        }
        const user = await this.usersService.findOne(user_id);

        return await this.sharedOperationsService.createEstoque(dto, user);
    }

    async enterEstoque(dto: EntradaEstoqueDto): Promise<QuantidadeEstoqueResponseDto> {
        const user_id = getUserIdService(this.request);
        if (!user_id) {
            throw new AppError(`ID do usuário logado não foi identificado`, 500);
        }
        const user = await this.usersService.findOne(user_id);

        return await this.sharedOperationsService.enterEstoque(dto, user);
    }

    async saidaEstoque(dto: SaidaEstoqueDto): Promise<QuantidadeEstoqueResponseDto> {
        const user_id = getUserIdService(this.request);
        if (!user_id) {
            throw new AppError(`ID do usuário logado não foi identificado`, 500);
        }
        const user = await this.usersService.findOne(user_id);

        return await this.sharedOperationsService.saidaEstoque(dto, user);
    }

    async findLojasSemProdutoX(produto_id: string) {
        const lojasComProdutoX = await this.estoquesRepository.find({
            where: { produto: { id: produto_id }, },
            relations: ['loja']
        });

        const ids = lojasComProdutoX.map((l) => l.loja.id);
        const [lojas, quantidade] = await this.lojasService.listAllRestrictedById(ids);

        return lojas;
    }

    async findEstoqueByLojaAndProduto(loja_id: string, produto_id: string): Promise<Estoque> {
        const estoque = await this.estoquesRepository.findOne({
            where: { loja: { id: loja_id }, produto: { id: produto_id }, },
            relations: ['produto', 'loja']
        });

        if (!estoque) {
            throw new AppError(`Produto ou loja não localizada`, 400);
        }
        return estoque;
    }

    async checkEstoque(loja_id: string, { produto_id, quantidade }: CreateItemProdutoDto): Promise<Estoque> {
        const estoque = await this.estoquesRepository.findOne({
            where: { loja: { id: loja_id }, produto: { id: produto_id }, },
            relations: ['produto', 'loja']
        });

        if (!estoque) {
            throw new AppError(`Produto ou loja não localizada`, 400);
        }
        if (estoque && estoque.quantidade < quantidade) {
            throw new AppError(`O produto ${estoque.produto.nome} possui apenas ${estoque.quantidade} 
            itens no estoque da loja ${estoque.loja.nome}`, 400);
        }

        return estoque;
    }

    async getProdutoItens(loja_id: string, produto_ids: string[]): Promise<Estoque[]> {

        const estoques = await this.estoquesRepository.find({
            where: { loja: { id: loja_id }, produto: { id: In(produto_ids) }, }
        });

        return estoques;
    }

    async findProdutosByLoja(loja_id: string,
        pageOptionsDto: PageOptionsDto,
        { descricao, nome, searchedProduto }: FilterProdutoDto) {
        const { skip, take, order } = pageOptionsDto;
        const query = this.estoquesRepository
            .createQueryBuilder("e")
            .leftJoinAndSelect("e.produto", "produto")
            .orderBy("produto.created_at", order)
            .skip(skip)
            .take(take)
            .where("e.loja_id = :loja_id", { loja_id });

        if (nome) {
            query.andWhere("produto.nome ILIKE :nome", { nome: `%${nome}%` });
        }

        if (descricao) {
            query.andWhere("produto.descricao ILIKE :descricao", { descricao: `%${descricao}%` });
        }

        if (searchedProduto) {
            query.andWhere(new Brackets(qb => {
                qb.where("produto.nome ILIKE :nome OR produto.descricao ILIKE :descricao", {
                    nome: `%${searchedProduto}%`,
                    descricao: `%${searchedProduto}%`,
                });
            }));
        }

        const [estoques, total] = await query.getManyAndCount();

        if (!estoques) {
            throw new AppError(`Não há produtos cadastrado na loja ${loja_id}`, 400);
        }
        const pageMetaDto = new PageMetaDto({ itemCount: total, pageOptionsDto });

        return new PageDto(estoques, pageMetaDto);
    }



}
