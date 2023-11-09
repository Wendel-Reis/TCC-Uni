import { Controller, Get, Post, Body, Param, Delete, Put, Query, UseGuards } from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LojasService } from './lojas.service';
import { CreateLojaDto } from './dto/create-loja.dto';
import { UpdateLojaDto } from './dto/update-loja.dto';
import { PageOptionsDto } from '../../shared/dtos/page/page-options.dto';
import { PageDto } from '../../shared/dtos/page/page.dto';
import { Loja } from './entities/loja.entity';
import { CreateEnderecoDto } from '../enderecos/dto/create-endereco.dto';

import { CheckPolicies } from '../../shared/authorizations/policies/check-policies.const';
import { Action } from '../../shared/authorizations/enums/action.enum';
import { AppAbility } from '../../shared/authorizations/casl/casl-ability.factory';
import { PoliciesGuard } from '../../shared/authorizations/policies/policy.guard';
import { FilterLojaDto } from './dto/filter-loja.dto';

@ApiBearerAuth()
@ApiTags('Lojas')
@Controller('lojas')
export class LojasController {

  constructor(private readonly lojasService: LojasService) { }
  
  @Post()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Loja))
  @ApiOperation({ summary: 'Cria uma nova loja' })
  @ApiResponse({ status: 200, isArray: false, type: Loja })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  async create(@Body() dto: CreateLojaDto,) {
    return await this.lojasService.create(dto);
  }

  @Post(':id/endereco')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Loja))
  @ApiOperation({ summary: 'Cria/Atualiza o endereço para uma loja' })
  @ApiResponse({ status: 200, isArray: false, type: Loja })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  @ApiParam({ name: 'id', required: true, type: String })
  createEndereco(@Param('id') id, @Body() createEnderecoDto: CreateEnderecoDto) {
    return this.lojasService.createLojaEndereco(id, createEnderecoDto);
  }

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Loja))
  @ApiOperation({ summary: 'Lista todas as lojas ativos' })
  @ApiResponse({ status: 200, isArray: true, type: PageDto })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  async findAll(@Query() pageOptionsDto: PageOptionsDto, @Query() filterDto: FilterLojaDto) {
    return await this.lojasService.findAll(pageOptionsDto, filterDto);
  }

  @Get(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Loja))
  @ApiOperation({ summary: 'Recupera um loja com base no ID passado' })
  @ApiResponse({ status: 200, isArray: false, type: Loja })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  findOne(@Param('id') id: string) {
    return this.lojasService.findOne(id);
  }

  @Put(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Loja))
  @ApiOperation({ summary: 'Atualiza uma loja' })
  @ApiResponse({ status: 200, isArray: false, type: Loja })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  @ApiParam({ name: 'id', required: true, type: String })
  update(@Param('id') id: string, @Body() dto: UpdateLojaDto) {
    return this.lojasService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, Loja))
  @ApiOperation({ summary: 'Deleta uma loja' })
  @ApiResponse({ status: 204, })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  remove(@Param('id') id: string) {
    return this.lojasService.remove(id);
  }
}
