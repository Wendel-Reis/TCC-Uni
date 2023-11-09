
import { Injectable } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { S3 } from "aws-sdk";
import * as fs from "fs";
import * as mime from "mime";
import { resolve } from "path";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LojasRepository } from '../../modules/lojas/repositories/implementations/LojasRepository';
import { PerfisRepository } from '../../modules/perfis/repositories/implementations/PerfisRepository';
import { Loja } from '../../modules/lojas/entities/loja.entity';
import { AppError } from '../../errors/AppError';
import { Perfil } from '../../modules/perfis/entities/perfil.entity';
import { ProdutosRepository } from '../../modules/produtos/repositories/implementations/ProdutosRepository';
import { Produto } from '../../modules/produtos/entities/produto.entity';
import { CreateNotificacoeDto } from '../../modules/notificacoes/dto/create-notificacoe.dto';
import { Notificacao } from '../../modules/notificacoes/entities/notificacoe.entity';
import { ProvidersEnum } from '../constants/providers.constant';
import { CreateArquivoGeralDto, DeleteArquivoGeralDto } from './shared-uploads/dto/create-arquivo-geral.dto';

@Injectable()
export class SharedService {
  private client: S3;

  constructor(
    @InjectRepository(Notificacao)
    private readonly notificacaoRepository: Repository<Notificacao>,
    private readonly lojasRepository: LojasRepository,
    private readonly perfisRepository: PerfisRepository,
    private readonly produtosRepository: ProdutosRepository,
  ) {
    this.client = new S3({
      region: process.env.AWS_BUCKET_REGION,
    });
  }

  async findOneLoja(id: string) {
    const lojaExists = await this.lojasRepository.findById(id);

    if (!lojaExists) {
      throw new AppError(`Loja ${id} não encontrado!`, 404);
    }
    return instanceToPlain(lojaExists, { groups: ['find'] }) as Loja;
  }

  async findOneProduto(id: string) {
    const produtoExists = await this.produtosRepository.findById(id);
    if (!produtoExists) {
      throw new AppError(`Produto ${id} não encontrado!`, 404);
    }
    return instanceToPlain(produtoExists, { groups: ['find'] }) as Produto;
  }

  async findOnePerfil(id: string) {
    const perfilExists = await this.perfisRepository.findById(id);

    if (!perfilExists) {
      throw new AppError(`Perfil ${id} não encontrado!`, 404);
    }
    return instanceToPlain(perfilExists, { groups: ['find'] }) as Perfil;
  }


  async uploadFile({ file, folder, bucket, provedor }: CreateArquivoGeralDto) {
    const extension = mime.getExtension(file.mimetype);
    await fs.promises.rename(file.path, `${file.path}.${extension}`);
    file.filename = `${file.filename}.${extension}`;

    const { filename } = file;

    if (provedor == ProvidersEnum.AWS) {
      const { mimetype, path } = file;
      const Body = await fs.promises.readFile(`${path}.${extension}`);
      const ContentType = mime.getType(mimetype);

      await this.client
        .putObject({
          Bucket: `${bucket}/${folder}`,
          Key: filename,
          Body,
          ContentType,
          ACL: "public-read",
        })
        .promise();

      await fs.promises.unlink(`${path}.${extension}`);
    }

    return filename;

  }

  async deleteFile({ file_name, folder, bucket, provedor }: DeleteArquivoGeralDto): Promise<void> {
    if (provedor == ProvidersEnum.AWS) {
      await this.client
        .deleteObject({
          Bucket: `${bucket}/${folder}`,
          Key: file_name,
        })
        .promise();
    } else {
      const filename = resolve(`temp`, file_name);
      try {
        await fs.promises.stat(filename);
        await fs.promises.unlink(filename);
      } catch {
        return;
      }
    }
  }

  async createNewNotification(createNotificacoeDto: CreateNotificacoeDto) {
    const notificacao = this.notificacaoRepository.create(createNotificacoeDto);
    notificacao.is_read = false;
    return await this.notificacaoRepository.save(notificacao);
  }

  async listAllProdutos() {
    const produtoList = await this.produtosRepository.listAll();
    return produtoList;
  }


}