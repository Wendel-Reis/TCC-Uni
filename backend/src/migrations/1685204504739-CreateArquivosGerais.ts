import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateArquivosGerais1685204504739 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "arquivos_gerais",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        isNullable: false,
                        comment: "Identificador único do arquivo",
                    },
                    {
                        name: "nome",
                        type: "varchar",
                        isNullable: false,
                        comment: "Nome do arquivo",
                    },
                    {
                        name: "bucket",
                        type: "varchar",
                        isNullable: false,
                        comment: "Bucket em que o arquivo se encontra",
                    },
                    {
                        name: "provedor",
                        type: "varchar",
                        isNullable: false,
                        comment: "Provedor cloud onde o arquivo está criado",
                    },
                    {
                        name: "tamanho",
                        type: "bigint",
                        isNullable: true,
                        comment: "Tamanho do arquivo em bytes",
                    },
                    {
                        name: "tipo",
                        type: "varchar",
                        isNullable: true,
                        comment: "Tipo do arquivo",
                    },
                    {
                        name: "descricao",
                        type: "varchar",
                        isNullable: true,
                        comment: "Descrição do arquivo",
                    },
                    {
                        name: "user_id",
                        type: "uuid",
                        isNullable: true,
                        comment: "Identificador do usuário associado ao arquivo",
                    },
                    {
                        name: "permissoes",
                        type: "jsonb",
                        isNullable: true,
                        comment: "Permissões de acesso ao arquivo",
                    },
                    {
                        name: "metadados",
                        type: "jsonb",
                        isNullable: true,
                        comment: "Metadados adicionais do arquivo",
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                        comment: "Data de criação do arquivo",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "now()",
                        comment: "Data de atualização do arquivo",
                    },
                    {
                        name: "deleted_at",
                        type: "timestamp",
                        isNullable: true,
                        comment: "Data de deleção do arquivo",
                    },
                ],
            })
        );

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('arquivos_gerais');
    }

}
