import { PartialType } from "@nestjs/mapped-types";

import { HistoricoDto } from "../../dto/historico.dto";
import { Loja } from "../../../../modules/lojas/entities/loja.entity";
import { Produto } from "../../../../modules/produtos/entities/produto.entity";
import { CargaDados } from "../../../../modules/carga-dados/entities/carga-dados.entity";

export class CreateEstoquesHistoricoDto extends PartialType(HistoricoDto) {
    loja?: Loja;
    loja_carga?: string;

    produto?: Produto;
    produto_carga?: string;

    quantidade_momento?: number;
    quantidade_alterada?: number;
    quantidade_atualizada?: number;

    carga?: CargaDados;
}
