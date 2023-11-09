import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

import { QuestionProdutoComponent } from './question-produto.component';

@NgModule({
  declarations: [QuestionProdutoComponent],
  imports: [
    CommonModule,
    IonicModule,
    DialogModule,
    ButtonModule,
    RippleModule,
  ],
  exports: [QuestionProdutoComponent],
})
export class QuestionProdutoModule { }
