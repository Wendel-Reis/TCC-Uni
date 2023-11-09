import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, Length, ValidateNested } from 'class-validator';
import { EstoqueMode } from '../../../shared/constants/estoque.constant';
import { IsUniqueCodigo } from '../validations/IsUniqueCodigo';
import { IsUniqueNome } from '../validations/IsUniqueNome';
import { RequestEstoqueCreationDto } from './request-estoque-creation.dto';

export class CreateLojaDto {
    @ApiProperty({ description: "Nome da loja", })
    @IsNotEmpty({ message: 'O campo "nome" é obrigatório!' })
    @IsUniqueNome()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    nome: string;

    @ApiPropertyOptional({
        description: "Uma descrição para a loja"
    })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    descricao?: string;

    @ApiProperty({ description: "Um código para ajudar na identificação da loja" })
    @IsNotEmpty({ message: 'O campo "codigo" é obrigatório!' })
    @Length(3, 3, { message: `O código deve conter exatamente três caracteres.` })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsUniqueCodigo()
    codigo: string;

    @ApiProperty({ description: "Dita se, ao criar a loja deve ser gerado um estoque com todos os produtos, se deve ser específicado, ou se não deve gerar estoques." })
    @IsNotEmpty({ message: 'O campo "estoque_mode" é obrigatório!' })
    @IsEnum(EstoqueMode, { message: `Tipo de estoque inválido!` })
    estoque_mode: string;

    @ApiPropertyOptional({
        description: "Array contendo todos os IDs dos produtos que se deseja criar estoque"
    })
    @IsOptional()
    @IsArray()
    @Type(() => RequestEstoqueCreationDto)
    @ValidateNested()
    produtos: RequestEstoqueCreationDto[];
}
