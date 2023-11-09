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
import { Endereco } from "../../../modules/enderecos/entities/endereco.entity";
import { User } from "../../../modules/users/entities/user.entity";
import { Estoque } from "../../../modules/estoques/entities/estoque.entity";


@Entity("lojas")
export class Loja {

    @ApiProperty({ description: "ID da loja", example: "3f8fd54e-0773-4103-9758-07871885a89e" })
    @PrimaryColumn()
    id: string;

    @ApiProperty({ description: "Código da loja", example: "001", minLength: 3, maxLength: 3 })
    @Column()
    codigo: string;

    @ApiProperty({ description: "Nome da loja", example: "Loja Domínio 01" })
    @Column()
    nome: string;

    @ApiProperty({ description: "Descrição da loja", example: "Loja de roupa no Norte Shopping" })
    @Column()
    descricao: string;

   

    @ApiProperty({ description: "Usuário que cadastrou a loja", type: () => User })
    @ManyToOne(() => User)
    @JoinColumn({ name: "user_registrou_id" })
    @Expose({ groups: ["find"] })
    user_registrou: User;

    @ApiProperty({ description: "Endereço da loja", type: () => Endereco })
    @OneToOne(() => Endereco, { cascade: true })
    @JoinColumn({ name: "endereco_id" })
    endereco: Endereco;

    @OneToMany(() => Estoque, (estoque) => estoque.loja)
    estoques: Estoque[];

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