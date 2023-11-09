
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
import { Exclude } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

import { User } from "../../../modules/users/entities/user.entity";

@Entity("carga_dados")
export class CargaDados {

    @PrimaryColumn()
    id: string;

    @Column()
    job_id: string;

    @Column()
    nome_job: string;

    @Column()
    nome_carga: string;

    @Column()
    descricao_carga: string;

    @Column()
    status: string;

    @Column()
    error_descricao: string;

    @Column()
    tabelas_afetadas: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "requester_user_id" })
    requester_user: User;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
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