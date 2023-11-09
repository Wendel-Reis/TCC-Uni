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

import { Loja } from "../../../modules/lojas/entities/loja.entity";
import { Produto } from "../../../modules/produtos/entities/produto.entity";

@Entity("estoques")
export class Estoque {

    @PrimaryColumn()
    @Exclude()
    id: string;

    @ManyToOne(() => Loja, (loja) => loja.estoques)
    @JoinColumn({ name: "loja_id", referencedColumnName: "id"})
    loja: Loja;

    @ManyToOne(() => Produto, (produto) => produto.estoques,)
    @JoinColumn({ name: "produto_id", referencedColumnName: "id"})
    produto: Produto;

    @Column()
    quantidade: number;

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
        if (!this.id) {
            this.id = uuidV4();
        }
    }
}