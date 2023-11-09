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
import { PasswordModule } from 'primeng/password';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RippleModule } from 'primeng/ripple';
import { ChipModule } from 'primeng/chip';
import { TagModule } from 'primeng/tag';
import { FileUploadModule } from 'primeng/fileupload';

import { CargaProdutosMainComponent } from './carga-produtos-main/carga-produtos-main.component';
import { DirectivesModule } from '../../directive/directives.module';
import { CargaProdutosUploadComponent } from './carga-produtos-upload/carga-produtos-upload.component';
import { CargaProdutosDetailComponent } from './carga-produtos-detail/carga-produtos-detail.component';
import { CargaEstoquesDetailComponent } from './carga-estoques-detail/carga-estoques-detail.component';

@NgModule({
  declarations: [
    CargaProdutosMainComponent, CargaProdutosUploadComponent, CargaProdutosDetailComponent,
    CargaEstoquesDetailComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    DataViewModule,
    PanelModule,
    DropdownModule,
    TabViewModule,
    InputTextModule,
    FileUploadModule,
    ButtonModule,
    FontAwesomeModule,
    RippleModule,
    ChipModule,
    TagModule,
    MessageModule,
    PasswordModule,
    InputMaskModule,
    InputSwitchModule,
    InputNumberModule,
    ConfirmDialogModule,
    DirectivesModule,
  ],
  exports: [
    CargaProdutosMainComponent, CargaProdutosUploadComponent, CargaProdutosDetailComponent,
    CargaEstoquesDetailComponent,
  ],
})
export class CargaProdutosModuleModule { }
