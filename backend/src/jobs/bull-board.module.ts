import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { BullBoardController } from './bull-board.controller';
import { BullBoardQueue } from './bull-board.queue';
import { SendMailJobModule } from './email/send-mail-job/send-mail-job.module';
import { CargaEstoquesJobModule } from './cargas/carga-estoques-job/carga-estoques-job.module';
import { CargaProdutosJobModule } from './cargas/carga-produtos-job/carga-produtos-job.module';
import { BullBoardAccessService } from './bull-board-acess.service';
import { jwtConstants } from '../modules/auth/constants/jwtConstants';
import { GenerateLojaEstoqueJobModule } from './lojas/generate-loja-estoque-job/generate-loja-estoque-job.module';
import { SpecifiedLojaEstoqueJobModule } from './lojas/specified-loja-estoque-job/specified-loja-estoque-job.module';

@Module({
    imports: [
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '60d' },
        }),
        SendMailJobModule,
        CargaEstoquesJobModule,
        CargaProdutosJobModule,
        GenerateLojaEstoqueJobModule,
        SpecifiedLojaEstoqueJobModule
    ],
    controllers: [BullBoardController],
    providers: [BullBoardQueue, BullBoardAccessService],
    exports: [BullBoardAccessService]
})
export class BullBoardModule { }
