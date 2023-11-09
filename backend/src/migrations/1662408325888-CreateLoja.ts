import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
} from "typeorm";

export class CreateLoja1662408325888 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "lojas",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "codigo",
                        type: "varchar",
                        isNullable: false,
                        isUnique: true,
                    },
                    {
                        name: "nome",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "descricao",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "user_registrou_id",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "endereco_id",
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
            "lojas",
            new TableForeignKey({
                name: "FKEnderecoLoja",
                referencedTableName: "enderecos",
                referencedColumnNames: ["id"],
                columnNames: ["endereco_id"],
                onDelete: "SET NULL",
                onUpdate: "SET NULL",
            })
        );

        await queryRunner.createForeignKey(
            "lojas",
            new TableForeignKey({
                name: "FKUserRegistrou",
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                columnNames: ["user_registrou_id"],
                onDelete: "SET NULL",
                onUpdate: "SET NULL",
            })
        );

        await queryRunner.addColumn(
            "patrimonios",
            new TableColumn({
                name: "loja_id",
                type: "uuid",
                isNullable: false,
            })
        );

        await queryRunner.createForeignKey(
            "patrimonios",
            new TableForeignKey({
                name: "FKLojaPatrimonio",
                referencedTableName: "lojas",
                referencedColumnNames: ["id"],
                columnNames: ["loja_id"],
                onDelete: "SET NULL",
                onUpdate: "SET NULL",
            })
        );

        await queryRunner.addColumn(
            "users",
            new TableColumn({
                name: "loja_id",
                type: "uuid",
                isNullable: true,
            })
        );

        await queryRunner.createForeignKey(
            "users",
            new TableForeignKey({
                name: "FKLojaUser",
                referencedTableName: "lojas",
                referencedColumnNames: ["id"],
                columnNames: ["loja_id"],
                onDelete: "SET NULL",
                onUpdate: "SET NULL",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("users", "FKLojaUser");
        await queryRunner.dropColumn("users", "loja_id");

        await queryRunner.dropForeignKey("patrimonios", "FKLojaPatrimonio");
        await queryRunner.dropColumn("patrimonios", "loja_id");

        await queryRunner.dropForeignKey("lojas", "FKUserRegistrou");
        await queryRunner.dropForeignKey("lojas", "FKEnderecoLoja");

        await queryRunner.dropTable("lojas");
    }

}
