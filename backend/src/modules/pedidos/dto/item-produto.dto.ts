import { Produto } from './../../produtos/entities/produto.entity';

export class ItemProdutoDto {
    quantidade: number;
    valor_unitario: number;
    sub_total: number;
    produto: Produto;
}