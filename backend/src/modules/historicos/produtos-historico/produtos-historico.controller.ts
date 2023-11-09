import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProdutosHistoricoService } from './produtos-historico.service';
import { CreateProdutosHistoricoDto } from './dto/create-produtos-historico.dto';
import { UpdateProdutosHistoricoDto } from './dto/update-produtos-historico.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProdutosHistorico } from './entities/produtos-historico.entity';

@Controller('produtos-historico')
export class ProdutosHistoricoController {
  constructor(private readonly produtosHistoricoService: ProdutosHistoricoService) {}

  @Get()
  requestReport() {
    //return this.estoquesHistoricoService.findAll();
  }

  @Get(':id')
 // @UseGuards(PoliciesGuard)
 // @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Despesa))
  @ApiOperation({ summary: 'Recupera o histórico de uma carga de produtos' })
  @ApiResponse({ status: 200, isArray: false, type: ProdutosHistorico })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  findOne(@Param('id') id: string) {
    return this.produtosHistoricoService.findByCargaId(id);
  }
}
