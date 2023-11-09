
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';


import { PerfilPageRoutingModule } from './perfil-routing.module';

import { PerfilPage } from './perfil.page';
import { DirectivesModule } from '../../shared/directive/directives.module';
import { AdmRecursoModuleModule } from './../../shared/components/adm-recurso-module/adm-recurso-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PerfilPageRoutingModule,
    DirectivesModule,
    AdmRecursoModuleModule
  ],
  declarations: [PerfilPage]
})
export class PerfilPageModule { }
