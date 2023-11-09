
import {
  Controller, Get, Post, Body, Param, Delete, Put, Query,
  UseInterceptors, UploadedFile, ParseFilePipeBuilder, HttpStatus, Patch, UseGuards
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { SearchPedidoDto } from './dto/search-pedido.dto';
import { Pedido } from './entities/pedido.entity';
import { CheckPolicies } from '../../shared/authorizations/policies/check-policies.const';
import { Action } from '../../shared/authorizations/enums/action.enum';
import { AppAbility } from '../../shared/authorizations/casl/casl-ability.factory';
import { PoliciesGuard } from '../../shared/authorizations/policies/policy.guard';
import { Role } from '../../shared/authorizations/enums/role.enum';
import { PageDto } from './../../shared/dtos/page/page.dto';
import { PageMetaDto } from './../../shared/dtos/page/page-meta.dto';
import { PageOptionsDto } from '../../shared/dtos/page/page-options.dto';
import { SuperPageOptionsDto } from './../../shared/dtos/super-page/super-page-options.dto';

@ApiBearerAuth()
@ApiTags('Pedidos (E-commerce)')
@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) { }

  @Post()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Pedido))
  @ApiOperation({
    summary: 'Cria um novo pedido',
  })
  @ApiResponse({ status: 200, isArray: false, type: Pedido })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  create(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidosService.create(createPedidoDto);
  }

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Pedido))
  @ApiOperation({ summary: 'Lista todos os pedidos de acordo com os parametros' })
  @ApiResponse({ status: 200, isArray: true, type: PageDto })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  async findAll(@Query() dto: SuperPageOptionsDto, @Query() filterDto: SearchPedidoDto) {
    return this.pedidosService.findAll(dto, filterDto);
  }

  @Get(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Pedido))
  @ApiOperation({ summary: 'Recupera um pedido com base no ID passado' })
  @ApiResponse({ status: 200, isArray: false, type: Pedido })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  findOne(@Param('id') id: string) {
    return this.pedidosService.findOne(id);
  }

  @Patch('/cancelar/:id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Pedido))
  @ApiOperation({ summary: 'Solicita o cancelamento de um pedido' })
  @ApiResponse({ status: 204, })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  solicitarCancelamento(@Param('id') id: string) {
    return this.pedidosService.solicitarCancelamento(id);
  }

  @Delete(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, Pedido))
  @ApiOperation({ summary: 'Cancela um pedido' })
  @ApiResponse({ status: 204, })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  cancelar(@Param('id') id: string) {
    return this.pedidosService.cancelar(id);
  }
}
