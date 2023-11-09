import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class FilterLojaDto {

    @ApiPropertyOptional({ description: "O nome da loja", example: "compras"})
    @Transform(({ value }: TransformFnParams) => value?.trim())
    nome?: string;

    @ApiPropertyOptional({
        description: "A descrição da loja", example: "compras"
    })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    descricao?: string;

    @ApiPropertyOptional({ description: "Nome, descrição ou código da loja", examples: ["dencia", "responsavel", "002"] })
    @IsOptional()
    searchedLoja?: string;

    @ApiPropertyOptional({ description: "Código da loja", example: "001" })
    @IsOptional()
    codigo?: number;
}
