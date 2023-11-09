import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from 'bull';

import { Estoque } from '../../../modules/estoques/entities/estoque.entity';
import { EntradaEstoqueDto } from '../../../modules/estoques/dto/entrada-estoque.dto';
import { SharedService } from '../../../shared/modules/shared.service';
import { QuantidadeEstoqueResponseDto } from '../../../modules/estoques/dto/quantidade-estoque-response.dto';
import { EstoquesHistoricoService } from '../../../modules/historicos/estoques-historico/estoques-historico.service';
import { OperationType } from '../../../shared/constants/operation-types.constant';
import { AcaoCarga } from '../../../shared/constants/carga-acao.constant';
import { CreateEstoquesHistoricoDto } from '../../../modules/historicos/estoques-historico/dto/create-estoques-historico.dto';
import { User } from '../../../modules/users/entities/user.entity';
import { SaidaEstoqueDto } from '../../../modules/estoques/dto/saida-estoque.dto';
import { CargaDados } from '../../../modules/carga-dados/entities/carga-dados.entity';
import { CreateCargaDadosDto } from '../../../modules/carga-dados/dto/create-carga-dados.dto';
import { AppError } from './../../../errors/AppError';
import { ValidarCartaoDto } from './../../../shared/dtos/payments/validar-cartao.dto';
import { CreateEstoqueDto } from './../../../modules/estoques/dto/create-estoque.dto';

@Injectable()
export class SharedOperationsService {

    constructor(
        @InjectRepository(Estoque)
        private readonly estoquesRepository: Repository<Estoque>,
        @InjectRepository(CargaDados)
        private readonly cargaDadosRepository: Repository<CargaDados>,
        private readonly sharedService: SharedService,
        private readonly estoquesHistoricoService: EstoquesHistoricoService,
    ) { }

    async createCarga(dto: CreateCargaDadosDto) {
        const cargaDados = this.cargaDadosRepository.create(dto);
        await this.cargaDadosRepository.save(cargaDados);
    }

    async updateCarga(cargaDados: CargaDados) {
        await this.cargaDadosRepository.save(cargaDados);
    }

    async findCargaByJob(job: Job) {
        const cargaDados = await this.cargaDadosRepository.findOne({ where: { job_id: job.id.toString(), nome_job: job.name } });

        return cargaDados;
    }

    async createEstoque(dto: CreateEstoqueDto, requester_user: User, quant_entrada = 0): Promise<QuantidadeEstoqueResponseDto> {
        const newDto: EntradaEstoqueDto = {
            loja_id: dto.loja_id,
            produto_id: dto.produto_id,
            quant_entrada,
        }
        return await this.enterEstoque(newDto, requester_user);
    }

    async enterEstoque(dto: EntradaEstoqueDto, requester_user: User): Promise<QuantidadeEstoqueResponseDto> {
        const loja = await this.sharedService.findOneLoja(dto.loja_id);
        const produto = await this.sharedService.findOneProduto(dto.produto_id);

        const estoque = await this.findEstoqueByProdutoAndLoja(dto.loja_id, dto.produto_id);
        estoque.loja = loja;
        estoque.produto = produto;

        const oldQuantidade = Number(estoque.quantidade);
        const quantidadeAlterada = dto.quant_entrada;
        estoque.quantidade = Number(dto.quant_entrada) + Number(oldQuantidade);

        const updatedEstoque = await this.estoquesRepository.save(estoque);

        await this.doHistorico(updatedEstoque, oldQuantidade, quantidadeAlterada, AcaoCarga.UP, requester_user);

        return new QuantidadeEstoqueResponseDto(updatedEstoque.quantidade);
    }

    async saidaEstoque(dto: SaidaEstoqueDto, requester_user: User): Promise<QuantidadeEstoqueResponseDto> {
        const loja = await this.sharedService.findOneLoja(dto.loja_id);
        const produto = await this.sharedService.findOneProduto(dto.produto_id);

        const estoque = await this.findEstoqueByProdutoAndLoja(dto.loja_id, dto.produto_id);
        estoque.loja = loja;
        estoque.produto = produto;

        const oldQuantidade = Number(estoque.quantidade);
        const quantidadeAlterada = dto.quant_saida;
        estoque.quantidade = Number(oldQuantidade) - Number(dto.quant_saida);

        const updatedEstoque = await this.estoquesRepository.save(estoque);

        await this.doHistorico(updatedEstoque, oldQuantidade, quantidadeAlterada, AcaoCarga.DOWN, requester_user);

        return new QuantidadeEstoqueResponseDto(updatedEstoque.quantidade);
    }

    async updateEstoque(estoque: Estoque) {
        const updatedEstoque = await this.estoquesRepository.save(estoque);
        return new QuantidadeEstoqueResponseDto(updatedEstoque.quantidade);
    }

    async findEstoqueByProdutoAndLoja(loja_id: string, produto_id: string) {
        const estoqueExists = await this.estoquesRepository.findOne({
            where: { loja: { id: loja_id }, produto: { id: produto_id }, }
        });
        if (estoqueExists) {
            return estoqueExists;
        }

        const estoque = new Estoque();
        estoque.quantidade = 0;
        return estoque;
    }


    async validateCard({ codigo_seguranca, validade, numero_cartao }: ValidarCartaoDto): Promise<string> {
        //TODO - Chamar API para validar o cartao e gerar o token de PGTO
        try {
            const mes = Number(validade.split('/')[0]);
            const ano = Number(validade.split('/')[1]).toString().substring(2);

            if (false) {
                throw new AppError(`Não foi possível validar o cartão para pagamentos`);
            }
            return 'tok_1N0X4U2eZvKYlo2CUQXhaTrt';
        } catch (error) {
            console.error(error);
            throw new AppError(`Não foi possível validar o cartão para pagamentos`);
        }
    }

    private async doHistorico(updatedEstoque: Estoque, oldQuantidade: number, quantidadeAlterada: number, acao: AcaoCarga, requester_user: User) {

        const dto: CreateEstoquesHistoricoDto = {
            produto: updatedEstoque.produto,
            loja: updatedEstoque.loja,
            tipo: OperationType.MANUAL,
            status: acao,
            quantidade_momento: Number(oldQuantidade),
            quantidade_atualizada: Number(updatedEstoque.quantidade),
            quantidade_alterada: Number(quantidadeAlterada),
            requester_user,
        };

        await this.estoquesHistoricoService.create(dto)
    }
}
