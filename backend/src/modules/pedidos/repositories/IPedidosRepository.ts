import { SearchPedidoDto } from './../dto/search-pedido.dto';
import { PageOptionsDto } from '../../../shared/dtos/page/page-options.dto';
import { PedidoDto } from './../dto/pedido.dto';
import { Pedido } from "../entities/pedido.entity";

export interface IPedidosRepository {
    //create(pedido: PedidoDto): Promise<Pedido>;
    findById(id: string): Promise<Pedido>;
    list(pageOptionsDto: PageOptionsDto, searchDto: SearchPedidoDto): Promise<[Pedido[], number]>;
}
