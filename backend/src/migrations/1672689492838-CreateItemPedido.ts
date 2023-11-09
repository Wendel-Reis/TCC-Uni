import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm"

export class CreateItemPedido1672689492838 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "item_pedidos",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isNullable: false,
                        isPrimary: true,
                    },
                    {
                        name: "quantidade",
                        type: "numeric",
                        isNullable: false,
                    },
                    {
                        name: "valor_unitario",
                        type: "numeric",
                        isNullable: false,
                    },
                    {
                        name: "sub_total",
                        type: "numeric",
                        isNullable: false,
                    },
                    {
                        name: "produto_id",
                        type: "uuid",
                        isNullable: false
                    },
                    {
                        name: "pedido_id",
                        type: "uuid",
                        isNullable: false
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
            "item_pedidos",
            new TableForeignKey({
                name: "FKProduto",
                referencedTableName: "produtos",
                referencedColumnNames: ["id"],
                columnNames: ["produto_id"],
                onDelete: "SET NULL",
                onUpdate: "SET NULL",
            })
        );

        await queryRunner.createForeignKey(
            "item_pedidos",
            new TableForeignKey({
                name: "FKPedido",
                referencedTableName: "pedidos",
                referencedColumnNames: ["id"],
                columnNames: ["pedido_id"],
                onDelete: "SET NULL",
                onUpdate: "SET NULL",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(
            "item_pedidos",
            "FKPedido"
        );

        await queryRunner.dropForeignKey(
            "item_pedidos",
            "FKProduto"
        );
        
        await queryRunner.dropTable("item_pedidos");
    }

}
