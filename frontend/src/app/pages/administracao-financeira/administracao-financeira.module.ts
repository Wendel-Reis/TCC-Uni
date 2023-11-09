
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdministracaoFinanceiraPageRoutingModule } from './administracao-financeira-routing.module';

import { AdministracaoFinanceiraPage } from './administracao-financeira.page';
import { DirectivesModule } from './../../shared/directive/directives.module';
import { AdmFincanceiraModule } from '../../shared/components/adm-financeira-module/adm-fincanceira.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdministracaoFinanceiraPageRoutingModule,
    AdmFincanceiraModule,
    DirectivesModule
  ],
  declarations: [AdministracaoFinanceiraPage]
})
export class AdministracaoFinanceiraPageModule {}
