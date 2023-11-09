import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { IsUniqueNome } from '../validations/IsUniqueNome';

export class CreateProdutoDto {

    @ApiProperty({ description: "O nome do produto", example: "Xbox Series X"})
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsUniqueNome()
    nome: string;

    @ApiProperty({
        description: "A descrição do produto", example: "Console de última geração da Microsoft"
    })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    descricao: string;
   

    @ApiProperty({
        description: "O valor do preço de compra do produto", example: 3000
    })
    @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 }, 
        { message: `O campo "preco_compra"  deve ser um número com duas casas decimais e finito` })
    preco_compra: number;
   

    @ApiProperty({
        description: "O valor do preço de venda do produto", example: 5000
    })
    @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 }, 
        { message: `O campo "preco_venda"  deve ser um número com duas casas decimais e finito` })
    preco_venda: number;

    @ApiPropertyOptional({ description: "ID da imagem anexado préviamente", example: "3f8fd54e-0773-4103-9758-07871885a89e" })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsOptional()
    imagem_principal_id?: string;
}
