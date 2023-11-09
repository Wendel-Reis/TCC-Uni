import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsPositive, IsUUID } from "class-validator";


export class LojaNaoCadastradaDto {

    @ApiProperty({ description: "ID da loja", })
    id: string;

    @ApiProperty({ description: "Nome da loja", })
    nome: string;

    @ApiPropertyOptional({
        description: "Uma descrição para a loja"
    })
    descricao?: string;

    @ApiProperty({ description: "Um código para ajudar na identificação da loja" })
    codigo: string;

}