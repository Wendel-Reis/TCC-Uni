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
import { InputSwitchModule } from 'primeng/inputswitch';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { SliderModule } from 'primeng/slider';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';

import { AttentionSurfaceModule } from '../../../utils/attention-surface/attention-surface.module';
import { DirectivesModule } from '../../../../directive/directives.module';
import { PedidoDetailComponent } from './pedido-detail.component';


@NgModule({
  declarations: [PedidoDetailComponent],
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    IonicModule,

    FontAwesomeModule,
    DataViewModule,
    PanelModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    TabViewModule,
    MessageModule,
    InputMaskModule,
    CalendarModule,
    InputNumberModule,
    RadioButtonModule,
    InputSwitchModule,
    TableModule,
    ConfirmDialogModule,
    DialogModule,
    SliderModule,
    InputTextareaModule,
    CheckboxModule,

    AttentionSurfaceModule,
    DirectivesModule,
  ],
  exports: [PedidoDetailComponent],
})
export class PedidoDetailModule { }
