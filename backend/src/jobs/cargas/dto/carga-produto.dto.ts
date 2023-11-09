import { BasicCargaJobDto } from "../../../jobs/BasicJob.dto";
import { User } from "../../../modules/users/entities/user.entity";

export class CargaProdutoDto {
    nome: string;
    descricao: string;
    preco_compra: number;
    preco_venda: number;
}

export class CargaProdutoRequestDto extends BasicCargaJobDto {}

export class CargaProdutoResponseDto {
    nome: string;
    descricao: string;
    preco_compra: number;
    preco_venda: number;
    acao: string;
}