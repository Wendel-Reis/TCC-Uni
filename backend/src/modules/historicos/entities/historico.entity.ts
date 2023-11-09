import { Column, Entity, TableInheritance } from "typeorm";

export abstract class HistoricoBaseEntity {
    @Column()
    tipo: string;

    @Column()
    status: string;

    @Column()
    erro_descricao: string;
}





