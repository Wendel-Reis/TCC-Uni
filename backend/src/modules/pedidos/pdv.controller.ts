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

import { CreatePedidoDto } from './dto/create-pedido.dto';
import { Pedido } from './entities/pedido.entity';
import { CheckPolicies } from '../../shared/authorizations/policies/check-policies.const';
import { Action } from '../../shared/authorizations/enums/action.enum';
import { AppAbility } from '../../shared/authorizations/casl/casl-ability.factory';
import { PoliciesGuard } from '../../shared/authorizations/policies/policy.guard';
import { PdvService } from './pdv.service';

@ApiBearerAuth()
@ApiTags('Pedidos (PDV)')
@Controller('pedidos/pdv')
export class PDVController {
  constructor(private readonly pdvService: PdvService) { }

  @Post()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Pedido))
  @ApiOperation({
    summary: 'Cria um novo pedido (PDV)',
  })
  @ApiResponse({ status: 200, isArray: false, type: Pedido })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  create(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pdvService.create(createPedidoDto);
  }
}
