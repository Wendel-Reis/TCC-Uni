import { PagamentoFormasEnum } from '../../constants/pagamento-formas.constant';
import { LocalPedidoEnum, StatusPedidoEnum } from '../../constants/status-pedido.constant';
import { CreateItemProdutoDto, ItemProdutoDto } from '../itens-produto/item-produto.dto';
import { LojaBasicDto } from '../lojas/loja.dto';
import { UserDto } from '../users/user.dto';

export interface PedidoDto {
    id: string;
    descricao: string;

    total_pedido: number;
    total_devido: number;
    acrescimo_desconto: number;

    status_pedido: StatusPedidoEnum;
    pagamento_forma: PagamentoFormasEnum;

    from_pdv: boolean;

    created_at: Date;
    updated_at: Date;
    deleted_at: Date;

    cliente: UserDto;
    vendedor: UserDto;

    loja: LojaBasicDto;

    itens_produto: ItemProdutoDto;
}

export interface CreatePedidoDto {
    pagamento_forma: PagamentoFormasEnum;
    vendedor_id: string;
    loja_id: string;

    valor_desconto?: number;
    valor_acrescimo?: number;
    percentual_desconto?: number;
    percentual_acrescimo?: number;
    descricao?: string;

    item_produto: CreateItemProdutoDto[];
}



export class SearchPedidoDto {
    loja_id?: string;
    vendedor_id?: string;
    cliente_id?: string;

    searchedLoja?: string;
    searchedVendedor?: string;
    searchedCliente?: string;
    searchedPedido?: string;

    min_total?: number;
    max_total?: number;

    acrescimo_desconto?: number;
    local?: LocalPedidoEnum;
    pagamento_forma?: string;
    status_pedido?: StatusPedidoEnum;

    created_at?: Date;
}