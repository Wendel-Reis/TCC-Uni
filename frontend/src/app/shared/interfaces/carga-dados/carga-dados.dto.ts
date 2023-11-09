import { CoverImgs } from "../../constants/images.constant";
import { UserDto } from "../users/user.dto";

export interface SearchCargasDto {
    user_id: string;
    status?: string;
    data?: Date;
    nome_carga?: string;
}

export interface CargaDadosDto {
    id: string;
    job_id: string;
    nome_job: string;
    nome_carga: string;
    descricao_carga: string;
    status: string;
    error_descricao: string;
    tabelas_afetadas: string;
    created_at: Date;
    updated_at: Date;
    requester_user: UserDto;
}

export interface CargaDadosList {
    nome_carga: string;
    descricao_carga: string;
    image?: string;
}

export enum CargaNome {
    CARGA_PRODUTOS = 'Carga de Produtos',
    CARGA_ESTOQUE = 'Carga de Estoques',
}

export enum CargaDescricao {
    CARGA_PRODUTOS = 'Carga de produtos para criar novos produtos, ou atualizar produtos já existentes',
    CARGA_ESTOQUE = 'Carga de estoques para acrescentar ou decrementar a quantidade de um produto em uma loja',
}

export const CargaListConst: CargaDadosList[] = [
    {
        nome_carga: CargaNome.CARGA_ESTOQUE,
        descricao_carga: CargaDescricao.CARGA_ESTOQUE,
        image: CoverImgs.CARGA_ESTOQUE,
    },
    {
        nome_carga: CargaNome.CARGA_PRODUTOS,
        descricao_carga: CargaDescricao.CARGA_PRODUTOS,
        image: CoverImgs.CARGA_PRODUTO,
    },
];

