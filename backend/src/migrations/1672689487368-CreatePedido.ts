import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm"

export class CreatePedido1672689487368 implements MigrationInterface {

    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "pedidos",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isNullable: false,
                        isPrimary: true,
                    },
                    {
                        name: "descricao",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "pagamento_forma",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "status_pedido",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "total_pedido",
                        type: "numeric",
                        isNullable: false,
                    },
                    {
                        name: "total_devido",
                        type: "numeric",
                        isNullable: false,
                    },
                    {
                        name: "acrescimo_desconto",
                        type: "numeric",
                        isNullable: false,
                    },
                    {
                        name: "cliente_id",
                        type: "uuid",
                        isNullable: false
                    },
                    {
                        name: "vendedor_id",
                        type: "uuid",
                        isNullable: false
                    },
                    {
                        name: "loja_id",
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
            "pedidos",
            new TableForeignKey({
                name: "FKCliente",
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                columnNames: ["cliente_id"],
                onDelete: "SET NULL",
                onUpdate: "SET NULL",
            })
        );

        await queryRunner.createForeignKey(
            "pedidos",
            new TableForeignKey({
                name: "FKVendedor",
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                columnNames: ["vendedor_id"],
                onDelete: "SET NULL",
                onUpdate: "SET NULL",
            })
        );

        await queryRunner.createForeignKey(
            "pedidos",
            new TableForeignKey({
                name: "FKLojaVenda",
                referencedTableName: "lojas",
                referencedColumnNames: ["id"],
                columnNames: ["loja_id"],
                onDelete: "SET NULL",
                onUpdate: "SET NULL",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(
            "pedidos",
            "FKLojaVenda"
        );
        await queryRunner.dropForeignKey(
            "pedidos",
            "FKVendedor"
        );
        await queryRunner.dropForeignKey(
            "pedidos",
            "FKCliente"
        );
        await queryRunner.dropTable("pedidos");
    }

}
