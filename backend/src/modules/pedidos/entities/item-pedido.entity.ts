
import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";
import { v4 as uuidV4 } from "uuid";
import { Produto } from './../../produtos/entities/produto.entity';
import { Pedido } from './pedido.entity';


@Entity("item_pedidos")
export class ItemPedido {

    @ApiProperty({ description: "ID do item", example: "3f8fd54e-0773-4103-9758-07871885a89e" })
    @PrimaryColumn()
    id: string;

    @ApiProperty({ description: "Quantidade comprada", example: 20 })
    @Column()
    quantidade: number;

    @ApiProperty({ description: "Valor unitário do produto no ato da compra", example: 250.89 })
    @Column()
    valor_unitario: number;

    @ApiProperty({ description: "Sub total do produto no ato da compra", example: 250.89 })
    @Column()
    sub_total: number;

    @ApiProperty({ description: "Item de produto", type: () => Produto })
    @ManyToOne(() => Produto)
    @JoinColumn({ name: "produto_id" })
    produto: Produto;

    @ApiProperty({ description: "Pedido no qual o item se encontra", type: () => Pedido })
    @ManyToOne(() => Pedido)
    @JoinColumn({ name: "pedido_id" })
    pedido: Pedido;

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