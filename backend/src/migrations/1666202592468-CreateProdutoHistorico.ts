import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm"

export class CreateProdutoHistorico1666202592468 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createTable(
            new Table({
                name: "historico_produtos",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "requester_user_id",
                        type: "uuid",
                        isNullable: false,
                        isUnique: false,
                    },
                    {
                        name: "produto_id",
                        type: "uuid",
                        isNullable: true,
                        isUnique: false,
                    },
                    {
                        name: "preco_compra_atual",
                        type: "numeric",
                        isNullable: true,
                        isUnique: false,
                    },
                    {
                        name: "preco_venda_atual",
                        type: "numeric",
                        isNullable: true,
                        isUnique: false,
                    },
                    {
                        name: "preco_compra_atualizado",
                        type: "numeric",
                        isNullable: true,
                        isUnique: false,
                    },
                    {
                        name: "preco_venda_atualizado",
                        type: "numeric",
                        isNullable: true,
                        isUnique: false,
                    },
                    {
                        name: "tipo",
                        type: "varchar",
                        isNullable: true,
                        isUnique: false,
                    },
                    {
                        name: "status",
                        type: "varchar",
                        isNullable: false,
                        isUnique: false,
                    },
                    {
                        name: "erro_descricao",
                        type: "varchar",
                        isNullable: true,
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
            "historico_produtos",
            new TableForeignKey({
                name: "FKProdutoHistorico",
                referencedTableName: "produtos",
                referencedColumnNames: ["id"],
                columnNames: ["produto_id"],
                onDelete: "SET NULL",
                onUpdate: "SET NULL",
            })
        );

        await queryRunner.createForeignKey(
            "historico_produtos",
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
            "historico_produtos",
            "FKUsuarioRequisitante"
        );
        await queryRunner.dropForeignKey(
            "historico_produtos",
            "FKProdutoHistorico"
        );
        await queryRunner.dropTable("historico_produtos");
    }

}
