import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm"

export class AddCargaToHistoricoEstoque1667577527609 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('historico_estoques', new TableColumn({
            name: "carga_id",
            type: "uuid",
            isNullable: true,
        }));

        await queryRunner.createForeignKey(
            "historico_estoques",
            new TableForeignKey({
                name: "FKCarga",
                referencedTableName: "carga_dados",
                referencedColumnNames: ["id"],
                columnNames: ["carga_id"],
                onDelete: "SET NULL",
                onUpdate: "SET NULL",
            })
        );

        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(
            "historico_estoques",
            "FKCarga"
        );
        await queryRunner.dropColumn('historico_estoques', 'carga_id');
    }

}
