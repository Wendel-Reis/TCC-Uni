import { ApiProperty } from "@nestjs/swagger";


export class QuantidadeEstoqueResponseDto {
    @ApiProperty({
        description: "Quantidade atual do produto em estoque atualizado", example: 5500
    })
    quantidade_atualizada: number;

    constructor(quantidade: number){
        this.quantidade_atualizada = quantidade;
    }
}