import { BasicJobDto } from './../../BasicJob.dto';
import { Loja } from './../../../modules/lojas/entities/loja.entity';
import { RequestEstoqueCreationDto } from '../../../modules/lojas/dto/request-estoque-creation.dto';

export class GenerateLojaEstoqueDto extends BasicJobDto {
    loja: Loja;
    produtos: RequestEstoqueCreationDto[];
}