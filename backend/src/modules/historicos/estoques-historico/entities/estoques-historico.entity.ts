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
import { Loja } from "../../../../modules/lojas/entities/loja.entity";
import { Produto } from "../../../../modules/produtos/entities/produto.entity";
import { User } from "../../../../modules/users/entities/user.entity";
import { CargaDados } from "../../../../modules/carga-dados/entities/carga-dados.entity";

@Entity("historico_estoques")
export class EstoqueHistorico extends HistoricoBaseEntity {

    @PrimaryColumn()
    @Exclude()
    id: string;

    @ManyToOne(() => Loja, (loja) => loja.estoques)
    @JoinColumn({ name: "loja_id", referencedColumnName: "id" })
    loja: Loja;

    @Column()
    loja_carga: string;

    @ManyToOne(() => Produto, (produto) => produto.estoques,)
    @JoinColumn({ name: "produto_id", referencedColumnName: "id" })
    produto: Produto;

    @Column()
    produto_carga: string;

    @Column()
    quantidade_momento: number;

    @Column()
    quantidade_alterada: number;

    @Column()
    quantidade_atualizada: number;

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