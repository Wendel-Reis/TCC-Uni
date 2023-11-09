import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm"


export class CreateEstoqueHistorico1666051120485 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createTable(
            new Table({
                name: "historico_estoques",
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
                        name: "loja_id",
                        type: "uuid",
                        isNullable: true,
                        isUnique: false,
                    },
                    {
                        name: "produto_id",
                        type: "uuid",
                        isNullable: true,
                        isUnique: false,
                    },
                    {
                        name: "loja_carga",
                        type: "varchar",
                        isNullable: true,
                        isUnique: false,
                    },
                    {
                        name: "produto_carga",
                        type: "varchar",
                        isNullable: true,
                        isUnique: false,
                    },
                    {
                        name: "quantidade_momento",
                        type: "numeric",
                        isNullable: true,
                        isUnique: false,
                    },
                    {
                        name: "quantidade_alterada",
                        type: "numeric",
                        isNullable: true,
                        isUnique: false,
                    },
                    {
                        name: "quantidade_atualizada",
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
            "historico_estoques",
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
            "historico_estoques",
            new TableForeignKey({
                name: "FKProdutoLoja",
                referencedTableName: "produtos",
                referencedColumnNames: ["id"],
                columnNames: ["produto_id"],
                onDelete: "SET NULL",
                onUpdate: "SET NULL",
            })
        );

        await queryRunner.createForeignKey(
            "historico_estoques",
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
            "historico_estoques",
            "FKUsuarioRequisitante"
        );
        await queryRunner.dropForeignKey(
            "historico_estoques",
            "FKProdutoLoja"
        );
        await queryRunner.dropForeignKey(
            "historico_estoques",
            "FKLojaProduto"
        );
        await queryRunner.dropTable("historico_estoques");
    }

}
