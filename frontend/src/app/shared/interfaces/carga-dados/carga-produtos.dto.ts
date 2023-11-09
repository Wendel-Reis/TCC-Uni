import { ProdutoBasicDto } from "../produtos/produto.dto";

export interface CargaProdutosDto {
    tipo: string;
    status: string;
    erro_descricao: string;
    preco_compra_atual: number;
    preco_venda_atual: number;
    preco_compra_atualizado: number;
    preco_venda_atualizado: number;
    produto: ProdutoBasicDto;
}