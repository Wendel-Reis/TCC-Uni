

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { StyleClassModule } from 'primeng/styleclass';
import { DataViewModule } from 'primeng/dataview';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { TabViewModule } from 'primeng/tabview';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PaginatorModule } from 'primeng/paginator';
import { MenuModule } from 'primeng/menu';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { MultiSelectModule } from 'primeng/multiselect';
import { SkeletonModule } from 'primeng/skeleton';
import { CalendarModule } from 'primeng/calendar';
import { PasswordModule } from 'primeng/password';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MessageModule } from 'primeng/message';
import { RadioButtonModule } from 'primeng/radiobutton'

import { PipeModule } from './../../pipes/pipe.module';
import { DirectivesModule } from '../../directive/directives.module';
import { PdvMainComponent } from './pdv-main/pdv-main.component';
import { PdvFechamentoComponent } from './pdv-fechamento/pdv-fechamento.component';
import { BrazilianMasksPipeModule } from '../../pipes/brazilian-masks/brazilian-masks-pipe.module';

@NgModule({
  declarations: [PdvFechamentoComponent, PdvMainComponent],
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    IonicModule,
    ButtonModule,
    InputNumberModule,
    RippleModule,
    RadioButtonModule,
    SkeletonModule,
    CalendarModule,
    PasswordModule,
    KeyFilterModule,
    DialogModule,
    DropdownModule,
    MenuModule,
    ToggleButtonModule,
    MultiSelectModule,
    PaginatorModule,
    DividerModule,
    CheckboxModule,
    StyleClassModule,
    DataViewModule,
    PanelModule,
    InputTextModule,
    TabViewModule,
    InputTextareaModule,
    MessageModule,
    PipeModule,
    BrazilianMasksPipeModule,
    DirectivesModule,
  ],
  exports: [PdvFechamentoComponent, PdvMainComponent],
})
export class PdvModuleModule { }
