
import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";
import { v4 as uuidV4 } from "uuid";
import { PagamentoFormasEnum } from './../../../shared/constants/pagamento-formas.constant';
import { StatusPedido } from './../../../shared/constants/status-pedido.constant';
import { Loja } from './../../lojas/entities/loja.entity';
import { User } from './../../users/entities/user.entity';
import { ItemPedido } from './item-pedido.entity';

@Entity("pedidos")
export class Pedido {

    @ApiProperty({ description: "ID do pedido", example: "3f8fd54e-0773-4103-9758-07871885a89e" })
    @PrimaryColumn()
    id: string;

    @ApiProperty({ description: "Motivo do acréscimo/desconto no pedido", example: 'Desconto de 10% por fidelidade' })
    @Column()
    descricao: string;

    @ApiProperty({ description: "Forma de pagamento", enum: PagamentoFormasEnum, example: PagamentoFormasEnum.DINHEIRO })
    @Column()
    pagamento_forma: PagamentoFormasEnum;

    @ApiProperty({ description: "Total do pedido, sem considerar acréscimos ou descontos", example: 500 })
    @Column()
    total_pedido: number;

    @ApiProperty({ description: "Total do pedido a ser pago já considerando acŕescimo ou desconto", example: 490.01 })
    @Column()
    total_devido: number;

    @ApiProperty({ description: "Valor acrescido ou descontado do pedido", example: 9.99 })
    @Column()
    acrescimo_desconto: number;

    @ApiProperty({ description: "Status do pedido", enum: StatusPedido, example: StatusPedido.CRIADO })
    @Column()
    status_pedido: StatusPedido;

    @ApiProperty({ description: "Identifica se o pedido veio do PDV ou não", example: true })
    @Column()
    from_pdv: boolean;

    @ApiProperty({ description: "Cliente que realizou a compra", type: () => User })
    @ManyToOne(() => User)
    @JoinColumn({ name: "cliente_id" })
    cliente: User;

    @ApiProperty({ description: "Vendedor que realizou a venda", type: () => User })
    @ManyToOne(() => User)
    @JoinColumn({ name: "vendedor_id" })
    vendedor: User;

    @ApiProperty({ description: "Loja em que ocorreu a compra", type: () => Loja })
    @ManyToOne(() => Loja)
    @JoinColumn({ name: "loja_id" })
    loja: Loja;

    @ApiProperty({ description: "Lista de benefícios do cargo", type: () => ItemPedido })
    @OneToMany(() => ItemPedido, (item) => item.pedido, { cascade: true })
    itens_produto: ItemPedido[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    constructor() {
        if (!this.id) {
            this.id = uuidV4();
        }
    }
}
