import { PagamentoFormasEnum } from './../../../shared/constants/pagamento-formas.constant';
import { StatusPedido } from './../../../shared/constants/status-pedido.constant';
import { User } from '../../users/entities/user.entity';
import { Loja } from './../../lojas/entities/loja.entity';


export class PedidoDto {
    id: string;
    descricao: string;
    pagamento_forma: PagamentoFormasEnum;
    itens_produto: any[];
    total_pedido: number;
    total_devido: number;
    acrescimo_desconto: number;
    status_pedido: StatusPedido;
    cliente: User;
    vendedor: User;
    loja: Loja;
}