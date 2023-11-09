import { BasicCargaJobDto } from "../../BasicJob.dto";
import { User } from "../../../modules/users/entities/user.entity";

export class CargaEstoqueDto {
    loja: string;
    produto: string;
    quantidade: number;
}

export class CargaEstoqueRequestDto extends BasicCargaJobDto {}

export class CargaEstoqueResponseDto {
    loja: string;
    produto: string;
    quantidade: number;
    acao: string;
}