import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import {
  TypeOrmModule,
} from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { DataSource } from 'typeorm';
import { PassportModule } from '@nestjs/passport';

import { AppController } from './app.controller';
import { UsersModule } from './modules/users/users.module';
import { EnderecosModule } from './modules/enderecos/enderecos.module';
import { PerfisModule } from './modules/perfis/perfis.module';
import { LojasModule } from './modules/lojas/lojas.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { MailsModule } from './modules/mails/mails.module';
import { getEmailOptions } from './config/mail-source';
import { UpdateResourceMiddleware } from './shared/middlewares/UpdateResourceMiddleware';
import { SharedModule } from './shared/modules/shared.module';
import { SharedSocketModule } from './modules/real-time/shared-socket.module';
import { ProdutosModule } from './modules/produtos/produtos.module';
import { BullModule } from '@nestjs/bull';
import { SendMailJobModule } from './jobs/email/send-mail-job/send-mail-job.module';
import { BullBoardModule } from './jobs/bull-board.module';
import { BullBoardController } from './jobs/bull-board.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulesModule } from './schedules/schedules.module';
import { BullJobHistoriesModule } from './modules/bull-job-histories/bull-job-histories.module';
import { CaslModule } from './shared/authorizations/casl/casl.module';
import { EstoquesModule } from './modules/estoques/estoques.module';
import { CargaDadosModule } from './modules/carga-dados/carga-dados.module';
import { ProdutosHistoricoModule } from './modules/historicos/produtos-historico/produtos-historico.module';
import { EstoquesHistoricoModule } from './modules/historicos/estoques-historico/estoques-historico.module';
import { NotificacoesModule } from './modules/notificacoes/notificacoes.module';
import { TemplateCargasModule } from './modules/central-download/template-cargas/template-cargas.module';
import { options } from './config/data-source';
import { SwaggerStatsAuthorizationMiddleware } from './shared/middlewares/SwaggerStatsAuthorizationMiddleware';
import { PedidosModule } from './modules/pedidos/pedidos.module';
import { HealthModule } from './modules/app-configs/health/health.module';
import { TerminusLoggerService } from './modules/app-configs/terminus-logger/terminus-logger.service';
import { XmlResponseInterceptor } from './shared/middlewares/ResponseTypeMiddleware';

require('dotenv').config();
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(options),
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: 'redis_tcc',
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD
      },
    }),
    MailerModule.forRoot(getEmailOptions()),
    PassportModule,
    ConfigModule,
    UsersModule,
    EnderecosModule,
    PerfisModule,
    LojasModule,
    AuthModule,
    MailsModule,
    SharedModule,
    SharedSocketModule,
    ProdutosModule,
    SendMailJobModule,
    BullBoardModule,
    SchedulesModule,
    BullJobHistoriesModule,
    CaslModule,
    EstoquesModule,
    CargaDadosModule,
    ProdutosHistoricoModule,
    EstoquesHistoricoModule,
    NotificacoesModule,
    TemplateCargasModule,
    PedidosModule,
    HealthModule,
  ],
  controllers: [AppController, BullBoardController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: XmlResponseInterceptor,
    },
    TerminusLoggerService,
  ],
  exports: [],
})

export class AppModule implements NestModule {
  constructor(
    private dataSource: DataSource,
  ) { }

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UpdateResourceMiddleware)
      .forRoutes(
        { path: 'beneficios/:id', method: RequestMethod.PUT },
        { path: 'perfis/:id', method: RequestMethod.PUT },
        { path: 'users/:id', method: RequestMethod.PUT },
        { path: 'patrimonios/:id', method: RequestMethod.PUT },
        { path: 'despesas/:id', method: RequestMethod.PUT },
        { path: 'lojas/:id', method: RequestMethod.PUT },
        { path: 'cargos/:id', method: RequestMethod.PUT },
        { path: 'produtos/:id', method: RequestMethod.PUT },
        { path: 'servicos/:id', method: RequestMethod.PUT },
        { path: 'areas/:id', method: RequestMethod.PUT },
        { path: 'agendas/*/:id', method: RequestMethod.PUT },
        { path: 'item-de-planos/:id', method: RequestMethod.PUT },
        { path: 'planos/:id', method: RequestMethod.PUT },
        { path: 'assinaturas/:id', method: RequestMethod.PUT },
        { path: 'tipo-operacoes-saida/:id', method: RequestMethod.PUT },
        { path: 'solicitacoes/:id', method: RequestMethod.PUT },
        { path: 'niveis-aprovacao/:id', method: RequestMethod.PUT },
        { path: 'configuracoes-aprovacao/:id', method: RequestMethod.PUT },
        { path: 'aprovacoes-user/:id', method: RequestMethod.PUT },
      );

    consumer
      .apply(SwaggerStatsAuthorizationMiddleware)
      .forRoutes(
        { path: 'status', method: RequestMethod.GET }
      );

  }
}

