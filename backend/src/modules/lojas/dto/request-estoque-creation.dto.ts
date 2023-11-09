import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsPositive, IsUUID } from "class-validator";

export class RequestEstoqueCreationDto{

    @IsUUID(null, { message: `O campo "produto_id" deve ser um UUID` })
    @ApiProperty({
        description: "ID do produto"
    })
    produto_id: string;
    
    @ApiProperty({
        description: "Quantidade de produtos que está entrando em estoque", example: 5000
    })
    @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
        { message: `O campo "quant_entrada"  deve ser um número sem casas decimais e finito` })
    quant_entrada: number;

}