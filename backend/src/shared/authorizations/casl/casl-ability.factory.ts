

import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects, MongoQuery } from "@casl/ability";
import { Inject, Injectable, Logger, forwardRef } from "@nestjs/common";
import { AnyObject } from '@casl/ability/dist/types/types';

import { Action } from "../enums/action.enum";
import { Role } from "../enums/role.enum";

import { FuncionalidadesConstants } from './../../constants/funcionalidades.constant';
import { Loja } from "../../../modules/lojas/entities/loja.entity";
import { Perfil } from "../../../modules/perfis/entities/perfil.entity";
import { User } from "../../../modules/users/entities/user.entity";
import { BullJobHistory } from "../../../modules/bull-job-histories/entities/bullJobHistory.entity";
import { Produto } from "../../../modules/produtos/entities/produto.entity";
import { Estoque } from "../../../modules/estoques/entities/estoque.entity";
import { Pedido } from './../../../modules/pedidos/entities/pedido.entity';
import { EstoqueHistorico } from './../../../modules/historicos/estoques-historico/entities/estoques-historico.entity';
import { StatusUsuarioEnum } from "./../../../shared/constants/status-usuario.constant";
import { TiposOperacoesConstant } from './../../constants/tipos-operacoes.constant';


type Subjects = InferSubjects<typeof Perfil | typeof User | typeof Loja
    | typeof BullJobHistory
    | typeof Produto | typeof Estoque | typeof Pedido | typeof EstoqueHistorico> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
    private readonly logger = new Logger(CaslAbilityFactory.name);

    constructor(
    ) { }

    async createForUser(user: any) {
        const { can, cannot, build } = new AbilityBuilder<
            Ability<[Action, Subjects]>
        >(Ability as AbilityClass<AppAbility>);
        this.logger.log(`Ambiente atual ${process.env.MODE}`);
        if (process.env.MODE == 'DEV') {
            this.logger.log(`Ambiente de teste/desenvolvimento selecionado`);
            this.logger.log(`Liberando acesso total`);
            can(Action.Manage, 'all');
            const buildedPerfil = build({
                detectSubjectType: (item) => {
                    return item.constructor as ExtractSubjectType<Subjects>;
                },
            });
            return buildedPerfil;
        }

        //Libera leitura para todos os perfis:
        this.logger.log(`Configuração inicial`);
        cannot(Action.Manage, 'all');
        can(Action.Read, [
            Produto, Estoque,
        ]);

        this.logger.log(`Recuperando autorizações do usuário ${user.id}\n`);

        // Define restricoes do sistema independente de perfil:
        this.logger.log(`\nDefinindo restrições do sistema independente de perfil`);
        this.logger.log(`Não pode deletar: Patrimonio, Perfil, Loja, Area`);
        cannot(Action.Delete, [Perfil, Loja]);
        can(Action.Read, [User]);

        const buildedPerfil = build({
            detectSubjectType: (item) => {
                return item.constructor as ExtractSubjectType<Subjects>;
            },
        });

        return buildedPerfil;
    }

    private definePolicyByRole({ can, cannot, perfil_nome, user_id }) {
        this.logger.log(`Definindo política para o perfil ${perfil_nome}\n`);
        // Define politica para o perfil ADMIN_TI:
        if (perfil_nome == Role.ADMIN_TI) {
            can(Action.Manage, [BullJobHistory, Loja, Perfil, User]);
        }

        // Define politica para o perfil ADMIN:
        if (perfil_nome == Role.ADMIN) {
            can(Action.Manage, [Loja, Produto, User, Estoque]);
            can(Action.Manage, [Pedido]);

        }

        // Define politica para o perfil GERENTE:
        if (perfil_nome == Role.GERENTE) {
            can(Action.Manage, [Loja, Produto, User, Estoque]);
            can(Action.Manage, [Estoque, Produto, Pedido]);
            cannot([Action.Create, Action.Delete], [Loja]);
        }

        // Define politica para o perfil SUPERVISOR:
        if (perfil_nome == Role.SUPERVISOR) {
            can(Action.Manage, [Estoque, Produto, Pedido]);
            can(Action.Update, [Produto, User]);
        }
        // Define politica para o perfil COLABORADOR:
        if (perfil_nome == Role.COLABORADOR) {
            //COLABORADORES devem poder atualizar seu proprio usuario - NOT WORKING
            can(Action.Update, User, { id: { $eq: user_id } });
            can(Action.Create, [Pedido,]);
        }
    }

    private definePolicyByAuthorization({ can, cannot, autorizacoes }) {
        this.logger.log(`Definindo política por autorizações explícitas\n`);

        const funcionalidadesAcoesMap = new Map<string, [Action, any[], MongoQuery<AnyObject>?]>([
            [FuncionalidadesConstants.administracao_recursos_id, [Action.Manage, [User,]]],
            [FuncionalidadesConstants.administracao_financeira_id, [Action.Read, [Pedido]]],
            [FuncionalidadesConstants.administracao_operacao_id, [Action.Manage, [Produto,]]],
            [FuncionalidadesConstants.administracao_loja_id, [Action.Manage, [Loja]]],

            [FuncionalidadesConstants.compra_produto_id, [Action.Manage, []]],
            [FuncionalidadesConstants.devolucao_concedida_id, [Action.Manage, []]],
            [FuncionalidadesConstants.pagamento_despesa_id, [Action.Manage, []]],
            [FuncionalidadesConstants.pagamento_despesa_id, [Action.Manage, []]],
            [FuncionalidadesConstants.pagamento_evento_id, [Action.Manage, []]],
            [FuncionalidadesConstants.pagamento_funcionario_id, [Action.Manage, []]],
            [FuncionalidadesConstants.pagamento_outros_id, [Action.Manage, []]],
            [FuncionalidadesConstants.pagamento_terceiros_id, [Action.Manage, []]],

            [FuncionalidadesConstants.venda_produto_id, [Action.Manage, [Pedido]]],

        ]);

        for (const [funcionalidadeId, [acao, recursos]] of funcionalidadesAcoesMap) {
            if (autorizacoes.some(a => {
                if (a.funcionalidade.id === funcionalidadeId) {
                    this.logger.log(`Usuário com autorização explícita à funcionalidade: ${a.funcionalidade.nome}`);
                    return true;
                }
                return false;
            })) {
                this.logger.log(`Ação: ${acao}`);
                this.logger.log(`Recursos: ${recursos.map(r => r.name).join(',')}\n`);
                can(acao, recursos);
            }
        }
    }

}