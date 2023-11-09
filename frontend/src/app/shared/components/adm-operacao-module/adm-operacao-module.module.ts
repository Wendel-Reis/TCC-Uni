
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { DataViewModule } from 'primeng/dataview';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { MessageModule } from 'primeng/message';
import { StepsModule } from 'primeng/steps';
import { PasswordModule } from 'primeng/password';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { FileUploadModule } from 'primeng/fileupload';

import { EstoqueModule } from '../estoque-module/estoque/estoque.module';
import { DirectivesModule } from '../../directive/directives.module';
import { ProdutoCadastroComponent } from './produtos/produto-cadastro/produto-cadastro.component';
import { ProdutoDetailComponent } from './produtos/produto-detail/produto-detail.component';
import { ProdutoMainComponent } from './produtos/produto-main/produto-main.component';
import { QuestionProdutoModule } from '../utils/dialogs/question-produto/question-produto.module';



@NgModule({
  declarations: [
    ProdutoMainComponent, ProdutoDetailComponent, ProdutoCadastroComponent,
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
    TableModule,
    FileUploadModule,
    InputTextModule,
    InputSwitchModule,
    CheckboxModule,
    InputTextareaModule,
    RadioButtonModule,
    ButtonModule,
    MessageModule,
    StepsModule,
    PasswordModule,
    InputMaskModule,
    InputSwitchModule,
    InputNumberModule,
    DialogModule,
    ConfirmDialogModule,
    DirectivesModule,
    EstoqueModule,
    QuestionProdutoModule,
  ],
  exports: [
    ProdutoMainComponent, ProdutoDetailComponent, ProdutoCadastroComponent,
  ]
})
export class AdmOperacaoModuleModule { }
