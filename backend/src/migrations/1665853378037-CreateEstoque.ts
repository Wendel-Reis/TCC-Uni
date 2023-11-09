import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm"

export class CreateEstoque1665853378037 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('produtos', 'quantidade');

        await queryRunner.createTable(
            new Table({
                name: "estoques",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "loja_id",
                        type: "uuid",
                    },
                    {
                        name: "produto_id",
                        type: "uuid",
                    },
                    {
                        name: "quantidade",
                        type: "numeric",
                        isNullable: false,
                        isUnique: false,
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
                ]
            })
        );



        await queryRunner.createForeignKey(
            "estoques",
            new TableForeignKey({
                name: "FKLojaProduto",
                referencedTableName: "lojas",
                referencedColumnNames: ["id"],
                columnNames: ["loja_id"],
                onDelete: "SET NULL",
                onUpdate: "SET NULL",
            })
        );

        await queryRunner.createForeignKey(
            "estoques",
            new TableForeignKey({
                name: "FKProdutoLoja",
                referencedTableName: "produtos",
                referencedColumnNames: ["id"],
                columnNames: ["produto_id"],
                onDelete: "SET NULL",
                onUpdate: "SET NULL",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(
            "estoques",
            "FKProdutoLoja"
        );
        await queryRunner.dropForeignKey(
            "estoques",
            "FKLojaProduto"
        );
        await queryRunner.dropTable("estoques");

        await queryRunner.addColumn('produtos', new TableColumn({
            name: "quantidade",
            type: "numeric",
            isNullable: true,
            isUnique: false,
        }));
    }

}
