import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm"

export class CreateCargaDados1666304567618 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "carga_dados",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "job_id",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "nome_job",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "requester_user_id",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "nome_carga",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "descricao_carga",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "status",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "error_descricao",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "tabelas_afetadas",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "deleted_at",
                        type: "timestamp",
                        isNullable: true,
                    },
                ],
            })
        );

        await queryRunner.createForeignKey(
            "carga_dados",
            new TableForeignKey({
                name: "FKUsuarioRequisitante",
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                columnNames: ["requester_user_id"],
                onDelete: "SET NULL",
                onUpdate: "SET NULL",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(
            "carga_dados",
            "FKUsuarioRequisitante"
        );
        await queryRunner.dropTable("carga_dados");
    }

}
