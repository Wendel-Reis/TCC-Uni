import { LojaBasicDto } from "../lojas/loja.dto";
import { ProdutoBasicDto } from "../produtos/produto.dto";

export interface CargaEstoquesDto {
    tipo: string;
    status: string;
    erro_descricao: string;
    loja_carga: number;
    produto_carga: number;
    quantidade_momento: number;
    quantidade_alterada: number;
    quantidade_atualizada: number;
    produto: ProdutoBasicDto;
    loja: LojaBasicDto;
}