import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableForeignKey,
} from "typeorm";

export class CreatePatrimonio1662162836368 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "patrimonios",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "nome",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "descricao",
                        type: "varchar",
                    },
                    {
                        name: "valor_patrimonio",
                        type: "numeric",
                        isNullable: false,
                    },
                    {
                        name: "status_patrimonio",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "user_registrou_id",
                        type: "uuid",
                        isNullable: true,
                    },
                    {
                        name: "current_user_id",
                        type: "uuid",
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
            "patrimonios",
            new TableForeignKey({
                name: "FKCreatedUser",
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                columnNames: ["user_registrou_id"],
                onDelete: "SET NULL",
                onUpdate: "SET NULL",
            })
        );

        await queryRunner.createForeignKey(
            "patrimonios",
            new TableForeignKey({
                name: "FKCurrentUser",
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                columnNames: ["current_user_id"],
                onDelete: "SET NULL",
                onUpdate: "SET NULL",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("patrimonios", "FKCurrentUser");
        await queryRunner.dropForeignKey("patrimonios", "FKCreatedUser");
        await queryRunner.dropTable("patrimonios");
    }

}
