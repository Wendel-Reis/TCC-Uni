import { PartialType } from "@nestjs/mapped-types";

import { HistoricoDto } from "../../dto/historico.dto";
import { Produto } from "../../../../modules/produtos/entities/produto.entity";
import { CargaDados } from "../../../../modules/carga-dados/entities/carga-dados.entity";

export class CreateProdutosHistoricoDto extends PartialType(HistoricoDto) {

    produto?: Produto;

    preco_compra_atual?: number;
    preco_venda_atual?: number;

    preco_compra_atualizado?: number;
    preco_venda_atualizado?: number;

    carga?: CargaDados;
}
