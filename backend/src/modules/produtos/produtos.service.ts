
import { forwardRef, Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { In } from 'typeorm';
import { instanceToPlain, plainToClass } from 'class-transformer';

import { PageMetaDto } from '../../shared/dtos/page/page-meta.dto';
import { PageOptionsDto } from '../../shared/dtos/page/page-options.dto';
import { AppError } from '../../errors/AppError';
import { PageDto } from '../../shared/dtos/page/page.dto';
import { getUserIdService } from '../../shared/utils/user-utils';
import { UsersService } from '../users/users.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { ProdutosRepository } from './repositories/implementations/ProdutosRepository';
import { FilterProdutoDto } from './dto/filter-produto.dto';
import { Produto } from './entities/produto.entity';
import { ProdutosHistoricoService } from '../historicos/produtos-historico/produtos-historico.service';
import { OperationType } from '../../shared/constants/operation-types.constant';
import { AcaoCarga } from '../../shared/constants/carga-acao.constant';
import { PatchProdutoImagemPrincipalDto } from './dto/patch-produto-imagem-principal.dto';
import { SharedUploadsService } from './../../shared/modules/shared-uploads/shared-uploads.service';
import { FolderPathEnum } from './../../shared/constants/folder-path.constant';
import { DefaultValuesUtils } from './../../shared/utils/defaultValuesUtils';

@Injectable({ scope: Scope.REQUEST })
export class ProdutosService {

  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
    private readonly produtosRepository: ProdutosRepository,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => SharedUploadsService))
    private readonly sharedUploadsService: SharedUploadsService,
    private readonly produtosHistoricoService: ProdutosHistoricoService,
  ) {
  }

  async pageAll(pageOptionsDto: PageOptionsDto, filterDto: FilterProdutoDto) {

    const [produtos, total] = await this.produtosRepository.list(pageOptionsDto, filterDto);

    const pageMetaDto = new PageMetaDto({ itemCount: total, pageOptionsDto });

    return new PageDto(produtos, pageMetaDto);
  }


  async listAll() {
    const produtoList = await this.produtosRepository.listAll();
    return produtoList;
  }

  async create(dto: CreateProdutoDto) {
    const user_id = getUserIdService(this.request);
    const user = await this.usersService.findOne(user_id);

    const imagem = dto.imagem_principal_id ? await this.sharedUploadsService.findById(dto.imagem_principal_id) : undefined;
    
    const produto = this.produtosRepository.create(dto);

    produto.user_registrou = user;
    produto.imagem_principal = imagem?.nome || undefined;

    const createdProduto = await this.produtosRepository.save(produto);

    await this.produtosHistoricoService.create({
      tipo: OperationType.MANUAL,
      status: AcaoCarga.CREATE,
      preco_compra_atual: null,
      preco_venda_atual: null,
      preco_compra_atualizado: createdProduto.preco_compra,
      preco_venda_atualizado: createdProduto.preco_venda,
      requester_user: user,
      produto: createdProduto,
    });

    return plainToClass(Produto, createdProduto);
  }

  async findOne(id: string) {
    const produtoExists = await this.checkIfProdutoExists(id);
    return instanceToPlain(produtoExists, { groups: ['find'] }) as Produto;
  }

  async update(id: string, dto: UpdateProdutoDto) {
    const user_id = getUserIdService(this.request);
    const user = await this.usersService.findOne(user_id);

    const produto = await this.checkIfProdutoExists(id);
    const newDto = dto as any;
    newDto.user_registrou = user;

    const imagem = dto.imagem_principal_id ? await this.sharedUploadsService.findById(dto.imagem_principal_id) : undefined;

    produto.imagem_principal = imagem?.nome || undefined;
    newDto.imagem_principal = imagem?.nome || undefined;

    const updatedProduto = await this.produtosRepository.save(newDto);

    await this.produtosHistoricoService.create({
      tipo: OperationType.MANUAL,
      status: AcaoCarga.UPDATED,
      preco_compra_atual: produto.preco_compra,
      preco_venda_atual: produto.preco_venda,
      preco_compra_atualizado: updatedProduto.preco_compra,
      preco_venda_atualizado: updatedProduto.preco_venda,
      requester_user: user,
      produto: updatedProduto,
    });

    return plainToClass(Produto, updatedProduto);
  }

  async remove(id: string) {
    await this.checkIfProdutoExists(id);

    await this.produtosRepository.softDelete({ id });
  }

  async findByIds(ids: string[]) {
    return await this.produtosRepository.findBy({ id: In(ids) });
  }

  async patchImagemPrincipal(id: string, { imagem_id }: PatchProdutoImagemPrincipalDto) {
    const arquivo = await this.sharedUploadsService.findByIdOrFail(imagem_id);
    const produto = await this.checkIfProdutoExists(id);
    produto.imagem_principal = arquivo.nome;

    return await this.produtosRepository.save(produto);
  }

  async createImagemPrincipal(file: Express.Multer.File, folder: FolderPathEnum) {
    const user_id = getUserIdService(this.request);
    const user = await this.usersService.findOne(user_id);

    const { bucket, provedor } = process.env.MODE == 'DEV' ?
      DefaultValuesUtils.getDevelopmentProviderAndBucket() :
      DefaultValuesUtils.getProductionProviderAndBucket();

    const anexo = await this.sharedUploadsService.uploadFileGeral({
      file,
      folder,
      user,
      bucket,
      provedor
    });

    return anexo;
  }

  private async checkIfProdutoExists(id: string): Promise<Produto> {
    const produtoExists = await this.produtosRepository.findById(id);

    if (!produtoExists) {
      throw new AppError(`Produto ${id} não encontrado!`, 404);
    }

    return produtoExists;
  }
}
