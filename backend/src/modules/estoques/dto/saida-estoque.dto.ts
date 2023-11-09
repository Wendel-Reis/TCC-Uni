import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsPositive, IsUUID } from "class-validator";


export class SaidaEstoqueDto {

    @IsUUID(null, { message: `O campo "produto_id" deve ser um UUID` })
    produto_id: string;

    @IsUUID(null, { message: `O campo "loja_id" deve ser um UUID` })
    loja_id: string;

    @ApiProperty({
        description: "Quantidade de produtos que está entrando em estoque", example: 5000
    })
    @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
        { message: `O campo "quant_saida"  deve ser um número sem casas decimais e finito` })
    @IsPositive({ message: `O campo "quant_saida"  deve ser um número POSITIVO` })
    quant_saida: number;

}