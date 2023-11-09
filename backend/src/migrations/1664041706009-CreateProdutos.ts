import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";

export class CreateProdutos1664041706009 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "produtos",
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
                        isUnique: true,
                    },
                    {
                        name: "descricao",
                        type: "varchar",
                        isNullable: false,
                        isUnique: false,
                    },
                    {
                        name: "preco_compra",
                        type: "numeric",
                        isNullable: false,
                        isUnique: false,
                    },
                    {
                        name: "preco_venda",
                        type: "numeric",
                        isNullable: false,
                        isUnique: false,
                    },
                    {
                        name: "quantidade",
                        type: "numeric",
                        isNullable: false,
                        isUnique: false,
                    },
                    {
                        name: "user_registrou_id",
                        type: "uuid",
                        isNullable: true
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
            "produtos",
            new TableForeignKey({
                name: "FKProdutoUserCreated",
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                columnNames: ["user_registrou_id"],
                onDelete: "SET NULL",
                onUpdate: "SET NULL",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("produtos", "FKProdutoUserCreated");
        await queryRunner.dropTable("produtos");
    }


}
