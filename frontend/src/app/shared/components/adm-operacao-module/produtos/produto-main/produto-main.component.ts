

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ComponentProps, ComponentRef } from '@ionic/core';
import { NavigationExtras, Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { Subscription } from 'rxjs';

import { ToastMessageService } from './../../../../services/toast/toast-message.service';
import { PageableDto } from './../../../../interfaces/others/pageable.dto';
import { ToastEnum, ToastPrimeSeverityEnum } from './../../../../constants/toast.constant';
import { PageOrder } from './../../../../constants/page.constant';

import { ProdutoDto } from './../../../../interfaces/produtos/produto.dto';
import { ProdutoCadastroComponent } from '../produto-cadastro/produto-cadastro.component';
import { ProdutoDetailComponent } from '../produto-detail/produto-detail.component';
import { ProdutoService } from './../../../../services/produto/produto.service';
import { CargaNome } from './../../../../interfaces/carga-dados/carga-dados.dto';
import { EstoqueViewComponent } from '../../../estoque-module/estoque/estoque-view/estoque-view.component';

@Component({
  selector: 'app-produto-main',
  templateUrl: './produto-main.component.html',
  styleUrls: ['./produto-main.component.scss'],
})
export class ProdutoMainComponent implements OnInit, OnDestroy {

  produtos: PageableDto<ProdutoDto>;
  sortOptions: SelectItem[] = [];
  searchedNome: string = '';
  currentPage = 1;

  isLoaded = false;

  private subscriptions = new Subscription();

  constructor(
    private readonly produtoService: ProdutoService,
    private readonly modal: ModalController,
    private readonly toastService: ToastMessageService,
    private readonly router: Router,
  ) { }

  ngOnInit() {
    this.loadProdutos();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadProdutos(page: number = 1, nome = undefined) {
    const sub = this.produtoService.list({ nome }, { order: PageOrder.DESC, page, take: 5 })
      .subscribe(data => {
        this.produtos = data;
        this.isLoaded = true;
      });

    this.subscriptions.add(sub);
  }


  changeFiltro(event) {
    const { value } = event;
    this.loadProdutos();
  }

  createNew() {
    this.showModal(ProdutoCadastroComponent);
  }

  editar(produto: ProdutoDto) {
    this.showModal(ProdutoDetailComponent, { produto });
  }

  estoque(produto: ProdutoDto) {
    this.showModal(EstoqueViewComponent, { produto });
  }

  search() {
    this.loadProdutos(1, this.searchedNome);
  }

  paginar(event) {
    const { first, rows } = event;
    const page = Number((Number(first) / Number(rows)) + 1);
    if (page != this.currentPage) {
      this.currentPage = page;
      this.loadProdutos(page);
    }
  }

  redirectCarga() {
    const extras: NavigationExtras = {
      queryParams: {
        tab: 'carregar',
        option: CargaNome.CARGA_PRODUTOS
      },
    };
    this.router.navigate(['/carga-dados'], extras);
  }

  private async showModal(
    component: ComponentRef,
    componentProps?: ComponentProps
  ) {
    const modal = await this.modal.create({
      component,
      backdropDismiss: false,
      cssClass: 'modal-size-80',
      componentProps,
    });

    modal.onDidDismiss()
      .then((data) => {
        const { data: hasUpdate, role } = data;

        if (hasUpdate) {
          this.loadProdutos(this.currentPage);

          if (role != 'estoque') {
            this.toastService.presentToast({
              detalhe: `Operação bem sucedida!`,
              titulo: `Sucesso!`,
              duracao: ToastEnum.mediumDuration,
              gravidade: ToastPrimeSeverityEnum.SUCESSO
            });
          }
        }

      });

    return await modal.present();
  }

}
