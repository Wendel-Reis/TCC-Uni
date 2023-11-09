import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class ChangeBigInt1685407344228 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn('arquivos_gerais', 'tamanho',
            new TableColumn({
                name: "tamanho",
                type: "numeric",
                isNullable: true,
                comment: "Tamanho do arquivo em bytes",
            }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn('arquivos_gerais', 'tamanho',
            new TableColumn({
                name: "tamanho",
                type: "bigint",
                isNullable: true,
                comment: "Tamanho do arquivo em bytes",
            }));
    }

}
