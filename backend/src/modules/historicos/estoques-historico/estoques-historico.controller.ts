import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EstoqueHistorico } from './entities/estoques-historico.entity';
import { EstoquesHistoricoService } from './estoques-historico.service';
import { AppAbility } from '../../../shared/authorizations/casl/casl-ability.factory';
import { Action } from '../../../shared/authorizations/enums/action.enum';
import { CheckPolicies } from '../../../shared/authorizations/policies/check-policies.const';
import { PoliciesGuard } from '../../../shared/authorizations/policies/policy.guard';

@ApiBearerAuth()
@ApiTags('Estoques (histórico)')
@Controller('estoques-historico')
export class EstoquesHistoricoController {
  constructor(private readonly estoquesHistoricoService: EstoquesHistoricoService) { }


  @Get(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, EstoqueHistorico))
  @ApiOperation({ 
    summary: 'Recupera o histórico de uma carga de estoque',
    description: `Retorna todos os dados processados de uma carga realizada de acordo com o ID passado`
   })
  @ApiResponse({ status: 200, isArray: false, type: EstoqueHistorico })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  findOne(@Param('id') id: string) {
    return this.estoquesHistoricoService.findByCargaId(id);
  }
}
