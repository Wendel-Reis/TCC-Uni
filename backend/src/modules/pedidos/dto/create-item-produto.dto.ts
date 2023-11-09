import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsPositive, IsUUID } from 'class-validator';

export class CreateItemProdutoDto {

    @ApiProperty({ description: "ID do produto sendo vendido",  example: "[3f8fd54e-0773-4103-9758-07871885a89e]" })
    @IsUUID(null, {  message: `ID inválido! Esperado um UUID` })
    produto_id: string;

    @ApiProperty({
        description: "A quantidade desejada", example: 50
    })
    @IsNumber({ allowInfinity: false, allowNaN: false },
        { message: `O campo "quantidade"  deve ser um número inteiro` })
    @IsPositive({ message: `O campo "quantidade"  deve ser um número positivo` })
    @IsOptional()
    quantidade: number;

    @ApiProperty({
        description: "O valor unitário do produto no ato da compra", example: 250.89
    })
    @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 },
        { message: `O campo "valor_unitario"  deve ser um número com duas casas decimais e finito` })
    @IsPositive({ message: `O campo "valor_unitario"  deve ser um número positivo` })
    @IsOptional()
    valor_unitario: number;

}