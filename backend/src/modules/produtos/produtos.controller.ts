
import { Controller, Get, Post, Body, Param, Delete, Put, Query, UseGuards, Patch, HttpStatus, ParseFilePipeBuilder, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { PageOptionsDto } from '../../shared/dtos/page/page-options.dto';
import { PageDto } from '../../shared/dtos/page/page.dto';
import { ProdutosService } from './produtos.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { Produto } from './entities/produto.entity';
import { FilterProdutoDto } from './dto/filter-produto.dto';

import { CheckPolicies } from '../../shared/authorizations/policies/check-policies.const';
import { Action } from '../../shared/authorizations/enums/action.enum';
import { AppAbility } from '../../shared/authorizations/casl/casl-ability.factory';
import { PoliciesGuard } from '../../shared/authorizations/policies/policy.guard';
import { FileTypeProdutoInterceptor } from './../../errors/interceptors/file-type-imagem.interceptor';
import { PatchProdutoImagemPrincipalDto } from './dto/patch-produto-imagem-principal.dto';
import { ArquivosTipoEnum } from './../../shared/constants/arquivos-tipo.constant';
import { RegexUtils } from './../../shared/utils/regexUtils';
import { FolderPathEnum } from './../../shared/constants/folder-path.constant';

@ApiBearerAuth()
@ApiTags('Produtos')
@Controller('produtos')
export class ProdutosController {
  constructor(private readonly produtosService: ProdutosService) { }

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Produto))
  @ApiOperation({ summary: 'Lista todos os produtos ativos' })
  @ApiResponse({ status: 200, isArray: true, type: PageDto })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  async pageAll(@Query() dto: PageOptionsDto, @Query() filter: FilterProdutoDto) {
    return await this.produtosService.pageAll(dto, filter);
  }

  @Post()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Produto))
  @ApiOperation({ summary: 'Cria um novo produto' })
  @ApiResponse({ status: 200, isArray: false, type: Produto })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  async create(@Body() dto: CreateProdutoDto) {
    return await this.produtosService.create(dto);
  }

  @Get(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Produto))
  @ApiOperation({ summary: 'Recupera um produto com base no ID passado' })
  @ApiResponse({ status: 200, isArray: false, type: Produto })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  findOne(@Param('id') id: string) {
    return this.produtosService.findOne(id);
  }

  @Put(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Produto))
  @ApiOperation({ summary: 'Atualiza um produto' })
  @ApiResponse({ status: 200, isArray: false, type: Produto })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  @ApiParam({ name: 'id', required: true, type: String })
  update(@Param('id',) id: string, @Body() dto: UpdateProdutoDto) {
    return this.produtosService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, Produto))
  @ApiOperation({ summary: 'Deleta um produto' })
  @ApiResponse({ status: 204, })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  remove(@Param('id') id: string) {
    return this.produtosService.remove(id);
  }

  /*@Post('venda')
@UseGuards(PoliciesGuard)
 @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Produto))
  @ApiOperation({ summary: 'Realiza a venda de um produto' })
  @ApiResponse({ status: 200, isArray: false, type: Produto })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  async doVenda(@Body() dto: CreateProdutoDto) {
    return await this.produtosService.create(dto);
  }
  */

  @Patch(':id/imagens/principal')
  @UseGuards(PoliciesGuard)
  @ApiOperation({
    summary: 'Associa uma imagem como imagem principal à um produto',
  })
  @ApiResponse({ status: 200, isArray: false, type: Produto })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  patchComprovante(@Param('id') id: string, @Body() dto: PatchProdutoImagemPrincipalDto) {
    return this.produtosService.patchImagemPrincipal(id, dto);
  }

  @Post('imagens/principal')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Produto))
  @UseInterceptors(FileInterceptor('file', { dest: FolderPathEnum.PRODUTO_IMAGEM_PRINCIPAL, }))
  @UseInterceptors(FileTypeProdutoInterceptor)
  @ApiOperation({
    summary: 'Realiza o upload de uma imagem para ser usado em associação com um produto',
  })
  @ApiResponse({ status: 200, isArray: false, type: Produto })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  anexarConta(@UploadedFile(
    new ParseFilePipeBuilder()
      .addFileTypeValidator({
        fileType: new RegExp(RegexUtils.generateRegexValidationForTypes([
          ArquivosTipoEnum.JPEG,
          ArquivosTipoEnum.PNG,
        ])),

      })
      .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY, fileIsRequired: true, })
  ) file: Express.Multer.File) {
    return this.produtosService.createImagemPrincipal(file, FolderPathEnum.SOLICITACOES_CONTA);
  }

}
