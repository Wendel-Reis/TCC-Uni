import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { TipoDescontoEnum } from '../../../shared/constants/tipo-desconto.constant';

export class FilterProdutoDto {

    @ApiPropertyOptional({ description: "O nome do benefício", example: "Xbox" })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    nome?: string;

    @ApiPropertyOptional({
        description: "A descrição do benefício", example: "geração" 
    })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    descricao?: string;

    @ApiPropertyOptional({
        description: "Nome ou descrição do produto", example: "Box" 
    })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    searchedProduto?: string;

/*
    @ApiPropertyOptional({
        description: "O valor descontado do funcionário"
    })
    @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 }, { message: `O campo "valor_desconto"  deve ser um número com duas casas decimais e finito` })
    @IsOptional()
    valor_desconto?: number;

    @ApiPropertyOptional({
        description: "O custo que este benefício gera para a empresa"
    })
    @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 }, { message: `O campo "custo_beneficio"  deve ser um número com duas casas decimais e finito` })
    @IsOptional()
    custo_beneficio?: number;*/
}
