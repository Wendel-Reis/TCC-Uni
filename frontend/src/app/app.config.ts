import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root',
})
export class AppConfig {

    theme: string = 'lara-light-indigo';

    dark: boolean = false;

    inputStyle: string = 'outlined';

    ripple: boolean = true;

    backgrounColorOn: boolean = false;

    appPages = [
        { title: 'Home', url: '/home', icon: 'home' },
        {
            title: 'Administração', icon: 'business', children: [
                { title: 'ADM. Geral', url: '/administracao-geral', icon: 'business' },
                { title: 'ADM. Operação', url: '/administracao-operacao', icon: 'cog' },
                { title: 'ADM. Recurso', url: '/administracao-recurso', icon: 'people' },
                { title: 'ADM. Financeira', url: '/administracao-financeira', icon: 'wallet' },
                { title: 'ADM. T.I', url: '/administracao-ti', icon: 'terminal' },
            ]
        },
        {
            title: 'Operações', icon: 'business', children: [
                { title: 'Cargas', url: '/carga-dados', icon: 'cloud-upload' },
            ]
        },
        {
            title: 'Vendas', icon: 'business', children: [
                // { title: 'E-commerce', url: '/e-commerce', icon: 'at' },
                { title: 'PDV', url: '/pdv', icon: 'storefront' },
            ]
        },
        {
            title: 'Usuário', icon: 'business', children: [
                { title: 'Perfil', url: '/perfil', icon: 'person' },
                { title: 'E-mail', url: '/comunicacao-email', icon: 'mail' },
            ]
        },
    ];

}