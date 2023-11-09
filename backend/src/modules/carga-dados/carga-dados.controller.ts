import { Controller, Get, HttpStatus, ParseFilePipeBuilder, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { CargaDadosService } from './carga-dados.service';
import { SearchCargasDto } from './dto/search-cargas.cto';
import { PageOptionsDto } from '../../shared/dtos/page/page-options.dto';
import { PageDto } from '../../shared/dtos/page/page.dto';
import { EnumsCargasDto } from './dto/enums-carga.dto';

@Controller('carga-dados')
export class CargaDadosController {

  constructor(
    private readonly cargaDadosService: CargaDadosService,
  ) { }

  @Get()
  // @UseGuards(PoliciesGuard)
  // @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Produto))
  @ApiOperation({ summary: 'Lista as cargas por usuário' })
  @ApiResponse({ status: 200, isArray: false, type: PageDto })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  async search(@Query() pageDto: PageOptionsDto, @Query() filterDto: SearchCargasDto) {
    return await this.cargaDadosService.search(pageDto, filterDto);
  }

  @Get('enums')
  // @UseGuards(PoliciesGuard)
  // @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Produto))
  @ApiOperation({ summary: 'Lista as enumerações de cargas' })
  @ApiResponse({ status: 200, isArray: true, type: EnumsCargasDto })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  async getEnums() {
    
    return this.cargaDadosService.getCargasEnum();
  }

  @Post('produtos')
  //@UseGuards(PoliciesGuard)
  //@CheckPolicies((ability: AppAbility) => ability.can(Action.Update, User))
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Realiza carga de dados criando/atualizando produtos a partir de um CSV' })
  @ApiResponse({ status: 204, })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  requestCargaProdutos(@UploadedFile(
    new ParseFilePipeBuilder()
      .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY, fileIsRequired: true, })
  ) file: Express.Multer.File) {
    return this.cargaDadosService.requestCargaProdutos(file);
  }

  @Post('estoques')
  //@UseGuards(PoliciesGuard)
  //@CheckPolicies((ability: AppAbility) => ability.can(Action.Update, User))
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Realiza carga de dados criando/atualizando estoque a partir de um CSV' })
  @ApiResponse({ status: 204, })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  requestCargaEstoques(@UploadedFile(
    new ParseFilePipeBuilder()
      .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY, fileIsRequired: true, })
  ) file: Express.Multer.File) {
    return this.cargaDadosService.requestCargaEstoques(file);
  }



}
