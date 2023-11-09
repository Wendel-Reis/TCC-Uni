import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AddImageToProdutos1688768210080 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('produtos', new TableColumn({
            name: "imagem_principal",
            type: "varchar",
            isNullable: true,
            comment: "URL da imagem principal do produto",
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('produtos', 'imagem_principal');
    }

}
