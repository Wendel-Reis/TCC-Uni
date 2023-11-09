import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { hash } from 'bcryptjs';
import { v4 as uuidV4 } from "uuid";


export class CreateSeed1663284030906 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        const user_id = 'e011ab87-e577-4ac5-afac-8ce39f976901';
        const loja_id = '79593d1f-e54f-4e7b-a6f4-2f6b0248d838';
        const admin_perfil_id = 'b6923d9b-9eb4-4abe-bea7-0ff97c4e0559';
        const passwordHash = await hash('Loja@74152', 8);

        try {
            await queryRunner.query(`
        insert into users(id, nome, email, senha, cpf, status) values('${user_id}','super-admin', 'super-admin@dominio.com', '${passwordHash}', '000000000', 'ATIVO');
        `);
        } catch (e) {
            console.error(`Erro ao criar o Super Admin: ${e.message}`)
        }

        try {
            await queryRunner.query(`
        insert into lojas(id, nome, descricao, user_registrou_id, codigo) values('${loja_id}','Administração T.I (NÃO UTILIZAR)', 'Administração T.I (NÃO UTILIZAR)', '${user_id}', '000');
        `);
        } catch (e) {
            console.error(`Erro ao criar o Loja da T.I: ${e.message}`)
        }



        try {
            await queryRunner.query(`
        insert into patrimonios (id, nome, descricao, valor_patrimonio , status_patrimonio , user_registrou_id, loja_id) 
        values('ea56a569-aee4-4cef-a917-0f811cd4727b', 'SERVIDOR (NÃO UTILIZAR)', 'SERVIDOR (NÃO UTILIZAR)', '0', 'ATIVO', '${user_id}', '${loja_id}');
        `);
        } catch (e) {
            console.error(`Erro ao criar o patrimonio do servidor: ${e.message}`)
        }

        try {
            await queryRunner.query(`
        insert  into perfis (id, nome, descricao) values ('861854b0-0a98-41a6-81e5-dae2e6d05574', 'COLABORADOR', 'Funcionário de uma loja');
        insert into perfis (id, nome, descricao) values ('7c38b234-5c4f-490b-9a31-37f39813bd5a', 'SUPERVISOR', 'Responsável pela gerência de uma loja');
        insert into perfis (id, nome, descricao) values ('46ab9369-cb84-463c-8cb4-6662bc35300b', 'GERENTE', 'Responsável pela gerência da empresa');
        insert into perfis (id, nome, descricao) values ('cbf8e449-a3b5-4841-892a-a8f1a4b5f1c1', 'ADMIN', 'Responsável pela administração da empresa');
        insert into perfis (id, nome, descricao) values ('${admin_perfil_id}', 'ADMIN-TI', 'Responsável pela administração do sistema e suas manutenções');`);
        } catch (e) {
            console.error(`Erro ao criar os perfis: ${e.message}`)
        }

        try {
            await queryRunner.query(`update users set loja_id = '${loja_id}', perfil_id = '${admin_perfil_id}' where id = '${user_id}';`);
        } catch (e) {
            console.error(`Erro ao atualizar o super admin: ${e.message}`)
        }

    }

    public async down(queryRunner: QueryRunner): Promise<void> {

    }

}
