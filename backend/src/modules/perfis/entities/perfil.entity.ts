import { User } from './../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";
import { Exclude } from 'class-transformer';
import { v4 as uuidV4 } from "uuid";

@Entity("perfis")
export class Perfil {

    @ApiProperty({ description: "ID do perfil", example: "3f8fd54e-0773-4103-9758-07871885a89e" })
    @PrimaryColumn()
    @ApiProperty()
    id: string;

    @ApiProperty({ description: "Nome do perfil", example: "GERENTE" })
    @Column()
    @ApiProperty()
    nome: string;

    @ApiProperty({ description: "Descrição do perfil", example: "Responsável pela gerência da empresa" })
    @Column()
    @ApiProperty()
    descricao: string;

    @CreateDateColumn()
    @Exclude()
    created_at: Date;

    @UpdateDateColumn()
    @Exclude()
    updated_at: Date;

    @DeleteDateColumn()
    @Exclude()
    deleted_at: Date;

    @ApiProperty({ description: "Lista de usuários com este perfil", type: () => User, isArray: true })
    @OneToMany(() => User, user => user.perfil, { cascade: false })
    users: User[];


    constructor() {
        if (!this.id) {
            this.id = uuidV4();
        }
    }
}


