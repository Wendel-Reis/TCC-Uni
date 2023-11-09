import { RequestEstoqueCreationDto } from './../../../modules/lojas/dto/request-estoque-creation.dto';
import { BasicJobDto } from '../../BasicJob.dto';
import { Loja } from '../../../modules/lojas/entities/loja.entity';

export class SpecifiedLojaEstoqueDto extends BasicJobDto {
    loja: Loja;
    produtos: RequestEstoqueCreationDto[];
}