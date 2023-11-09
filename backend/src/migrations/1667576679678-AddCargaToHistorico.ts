import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm"

export class AddCargaToHistorico1667576679678 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createPrimaryKey('carga_dados', ['id']);

        await queryRunner.addColumn('historico_produtos', new TableColumn({
            name: "carga_id",
            type: "uuid",
            isNullable: true,
        }));

        await queryRunner.createForeignKey(
            "historico_produtos",
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
        await queryRunner.dropPrimaryKey('carga_dados', 'id');
        await queryRunner.dropForeignKey(
            "historico_produtos",
            "FKCarga"
        );
        await queryRunner.dropColumn('historico_produtos', 'carga_id');
    }

}
