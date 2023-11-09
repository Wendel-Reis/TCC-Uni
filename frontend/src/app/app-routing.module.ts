/* eslint-disable max-len */
import { NgModule } from '@angular/core';
import { NoPreloading, PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardGuard } from './guards/auth-guard.guard';
import { Role } from './shared/constants/role.constants';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'password-reset',
    loadChildren: () => import('./pages/password-reset/password-reset.module').then(m => m.PasswordResetPageModule),
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
    canLoad: [AuthGuardGuard],
    canActivate: [AuthGuardGuard],
    data: {
      role: [Role.ADMIN, Role.ADMIN_TI],
    }
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then(m => m.PerfilPageModule),
    canLoad: [AuthGuardGuard],
    canActivate: [AuthGuardGuard],
    data: {
      role: [Role.ADMIN, Role.ADMIN_TI],
    }
  },
  {
    path: 'administracao-recurso',
    loadChildren: () => import('./pages/administracao-recurso/administracao-recurso.module').then(m => m.AdministracaoRecursoPageModule),
    canLoad: [AuthGuardGuard],
    canActivate: [AuthGuardGuard],
    data: {
      role: [Role.ADMIN, Role.ADMIN_TI],
    }
  },

  {
    path: 'administracao-financeira',
    loadChildren: () => import('./pages/administracao-financeira/administracao-financeira.module').then(m => m.AdministracaoFinanceiraPageModule),
    canLoad: [AuthGuardGuard],
    canActivate: [AuthGuardGuard],
    data: {
      role: [Role.ADMIN, Role.ADMIN_TI],
    }
  },
  {
    path: 'administracao-geral',
    loadChildren: () => import('./pages/administracao-geral/administracao-geral.module').then(m => m.AdministracaoGeralPageModule),
    canLoad: [AuthGuardGuard],
    canActivate: [AuthGuardGuard],
    data: {
      role: [Role.ADMIN, Role.ADMIN_TI],
    }
  },
  {
    path: 'administracao-operacao',
    loadChildren: () => import('./pages/administracao-operacao/administracao-operacao.module').then(m => m.AdministracaoOperacaoPageModule),
    canLoad: [AuthGuardGuard],
    canActivate: [AuthGuardGuard],
    data: {
      role: [Role.ADMIN, Role.ADMIN_TI],
    }
  },
  {
    path: 'carga-dados',
    loadChildren: () => import('./pages/carga-dados/carga-dados.module').then(m => m.CargaDadosPageModule),
    canLoad: [AuthGuardGuard],
    canActivate: [AuthGuardGuard],
    data: {
      role: [Role.ADMIN, Role.ADMIN_TI],
    }
  },
  {
    path: 'administracao-ti',
    loadChildren: () => import('./pages/administracao-ti/administracao-ti.module').then(m => m.AdministracaoTiPageModule),
    canLoad: [AuthGuardGuard],
    canActivate: [AuthGuardGuard],
    data: {
      role: [Role.ADMIN, Role.ADMIN_TI],
    }
  },
  {
    path: 'pdv',
    loadChildren: () => import('./pages/pdv/pdv.module').then(m => m.PdvPageModule),
    canLoad: [AuthGuardGuard],
  },
  {
    path: 'comunicacao-email',
    loadChildren: () => import('./pages/comunicacao-email/comunicacao-email.module').then(m => m.ComunicacaoEmailPageModule),
    canLoad: [AuthGuardGuard],
    canActivate: [AuthGuardGuard],
    data: {
      role: [Role.ADMIN, Role.ADMIN_TI],
    }
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
