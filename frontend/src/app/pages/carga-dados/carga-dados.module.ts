import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CargaDadosPageRoutingModule } from './carga-dados-routing.module';

import { CargaDadosPage } from './carga-dados.page';
import { CargaProdutosModuleModule } from 'src/app/shared/components/carga-dados-module/carga-produtos-module.module';
import { DirectivesModule } from 'src/app/shared/directive/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CargaDadosPageRoutingModule,
    CargaProdutosModuleModule,
    DirectivesModule,
  ],
  declarations: [CargaDadosPage]
})
export class CargaDadosPageModule {}
