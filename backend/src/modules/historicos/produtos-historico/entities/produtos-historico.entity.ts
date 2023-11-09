import { Exclude } from "class-transformer";
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { HistoricoBaseEntity } from "../../entities/historico.entity";
import { Produto } from "../../../../modules/produtos/entities/produto.entity";
import { User } from "../../../../modules/users/entities/user.entity";
import { CargaDados } from "../../../../modules/carga-dados/entities/carga-dados.entity";

@Entity("historico_produtos")
export class ProdutosHistorico extends HistoricoBaseEntity {

    @PrimaryColumn()
    @Exclude()
    id: string;

    @ManyToOne(() => Produto, (produto) => produto.estoques,)
    @JoinColumn({ name: "produto_id", referencedColumnName: "id" })
    produto: Produto;

    @Column()
    preco_compra_atual: number;

    @Column()
    preco_venda_atual: number;

    @Column()
    preco_compra_atualizado: number;

    @Column()
    preco_venda_atualizado: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: "requester_user_id" })
    requester_user: User;

    @ManyToOne(() => CargaDados)
    @JoinColumn({ name: "carga_id" })
    carga: CargaDados;

    @CreateDateColumn()
    @Exclude()
    created_at: Date;

    @UpdateDateColumn()
    @Exclude()
    updated_at: Date;

    @DeleteDateColumn()
    @Exclude()
    deleted_at: Date;

    constructor() {
        super();
        if (!this.id) {
            this.id = uuidV4();
        }

    }
}