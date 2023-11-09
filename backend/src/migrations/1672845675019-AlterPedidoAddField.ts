import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AlterPedidoAddField1672845675019 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('pedidos', new TableColumn({
            name: "from_pdv",
            type: "boolean",
            isNullable: false,
            default: false
        }));

        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('pedidos', 'from_pdv');
    }

}
