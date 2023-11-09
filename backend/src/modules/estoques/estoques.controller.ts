
import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { EntradaEstoqueDto } from './dto/entrada-estoque.dto';
import { SaidaEstoqueDto } from './dto/saida-estoque.dto';
import { QuantidadeEstoqueResponseDto } from './dto/quantidade-estoque-response.dto';
import { Estoque } from './entities/estoque.entity';
import { EstoquesService } from './estoques.service';
import { PageOptionsDto } from './../../shared/dtos/page/page-options.dto';
import { AppAbility } from '../../shared/authorizations/casl/casl-ability.factory';
import { Action } from '../../shared/authorizations/enums/action.enum';
import { CheckPolicies } from '../../shared/authorizations/policies/check-policies.const';
import { PoliciesGuard } from '../../shared/authorizations/policies/policy.guard';
import { LojaNaoCadastradaDto } from './dto/loja-nao-cadastrada.dto';
import { CreateEstoqueDto } from './dto/create-estoque.dto';
import { PageDto } from './../../shared/dtos/page/page.dto';
import { FilterProdutoDto } from '../produtos/dto/filter-produto.dto';

@ApiBearerAuth()
@ApiTags('Estoques')
@Controller('estoques')
export class EstoquesController {
  constructor(private readonly estoquesService: EstoquesService) { }

  @Get('/produto/:produto_id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Estoque))
  @ApiOperation({ 
    summary: 'Encontra lojas sem um determinado produto X',
    description: `Retornar todas as lojas que não possuem um determinado produto (ID)`
   })
  @ApiResponse({ status: 200, isArray: false, type: LojaNaoCadastradaDto })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  async listLojasSemProdutoX(@Param('produto_id') produto_id: string) {
    return await this.estoquesService.findLojasSemProdutoX(produto_id);
  }

  @Get("/loja/:loja_id")
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Estoque))
  @ApiOperation({ 
    summary: 'Encontra todos os produtos cadastrados em uma loja X',
    description: `Retornar todos os produtos cadastrados/associados habilitados para venda em uma loja X`
   })
  @ApiResponse({ status: 200, isArray: false, type: PageDto })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  async findProdutosByLoja(
    @Param('loja_id') loja_id: string,
    @Query() page: PageOptionsDto,
    @Query() dto: FilterProdutoDto
  ) {
    return await this.estoquesService.findProdutosByLoja(loja_id, page, dto);
  }

  @Post()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Estoque))
  @ApiOperation({ 
    summary: 'Cria o estoque de um produto em uma loja',
    description: `Cria o estoque de um produto X para uma loja Y, habilitando o mesmo a ser vendido por essa loja`
   })
  @ApiResponse({ status: 200, isArray: false, type: QuantidadeEstoqueResponseDto })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  async createEstoque(@Body() dto: CreateEstoqueDto) {
    return await this.estoquesService.createEstoque(dto);
  }

  @Put("/entrada")
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Estoque))
  @ApiOperation({ 
    summary: 'Dá entrada de um produto em estoque',
    description: `Dá entrada de uma quantidade X de um produto Y no estoque de uma loja Z`
   })
  @ApiResponse({ status: 200, isArray: false, type: QuantidadeEstoqueResponseDto })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  async enterEstoque(@Body() dto: EntradaEstoqueDto) {
    return await this.estoquesService.enterEstoque(dto);
  }

  @Put("/saida")
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Estoque))
  @ApiOperation({ 
    summary: 'Dá saída de um produto em estoque',
    description: `Dá saída de uma quantidade X de um produto Y no estoque de uma loja Z`
   })
  @ApiResponse({ status: 200, isArray: false, type: QuantidadeEstoqueResponseDto })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  async saidaEstoque(@Body() dto: SaidaEstoqueDto) {
    return await this.estoquesService.saidaEstoque(dto);
  }

}
