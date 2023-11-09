import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DataViewModule } from 'primeng/dataview';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { MessageModule } from 'primeng/message';
import { InputMaskModule } from 'primeng/inputmask';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { StepsModule } from 'primeng/steps';
import { PasswordModule } from 'primeng/password';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { SliderModule } from 'primeng/slider';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';

import { DirectivesModule } from '../../directive/directives.module';
import { PedidoMainComponent } from './pedidos/pedido-main/pedido-main.component';
import { AdmRecursoModuleModule } from '../adm-recurso-module/adm-recurso-module.module';
import { AttentionSurfaceModule } from '../utils/attention-surface/attention-surface.module';
import { PedidoDetailModule } from './pedidos/pedido-detail/pedido-detail.module';



@NgModule({
  declarations: [
    PedidoMainComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FontAwesomeModule,
    DataViewModule,
    PanelModule,
    DropdownModule,
    TabViewModule,
    InputTextModule,
    ButtonModule,
    SliderModule,
    MessageModule,
    InputMaskModule,
    InputNumberModule,
    InputMaskModule,
    CalendarModule,
    InputNumberModule,
    RadioButtonModule,
    StepsModule,
    PasswordModule,
    InputSwitchModule,
    TableModule,
    ConfirmDialogModule,
    DialogModule,
    InputTextareaModule,
    CheckboxModule,
    CalendarModule,
    AdmRecursoModuleModule,
    DirectivesModule,
    AttentionSurfaceModule,
    PedidoDetailModule,
  ],
  exports: [
    PedidoMainComponent,
    PedidoDetailModule,
  ]
})
export class AdmFincanceiraModule { }
