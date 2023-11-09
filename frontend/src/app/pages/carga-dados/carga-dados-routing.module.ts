import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CargaDadosPage } from './carga-dados.page';

const routes: Routes = [
  {
    path: '',
    component: CargaDadosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CargaDadosPageRoutingModule {}
