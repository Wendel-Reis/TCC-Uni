import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";


export class CreateEstoqueDto {

    @IsUUID(null, { message: `O campo "produto_id" deve ser um UUID` })
    produto_id: string;

    @IsUUID(null, { message: `O campo "loja_id" deve ser um UUID` })
    loja_id: string;

}