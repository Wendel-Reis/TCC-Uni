import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController, MenuController } from '@ionic/angular';
import { ComponentProps, ComponentRef } from '@ionic/core';

import { MenuItem, SelectItem } from 'primeng/api';
import { Dropdown } from 'primeng/dropdown';
import { Subscription } from 'rxjs';

import { ToastEnum, ToastPrimeSeverityEnum } from '../../../../shared/constants/toast.constant';
import { ToastMessageService } from './../../../services/toast/toast-message.service';
import { PageableDto } from './../../../interfaces/others/pageable.dto';
import { EstoqueProduto } from './../../../interfaces/estoques/estoque.dto';
import { PdvFechamentoComponent } from '../pdv-fechamento/pdv-fechamento.component';
import { LojaDto } from './../../../interfaces/lojas/loja.dto';
import { LojaService } from './../../../services/loja/loja.service';
import { CreateItemProdutoDto } from './../../../interfaces/itens-produto/item-produto.dto';
import { ProdutoBasicDto } from './../../../interfaces/produtos/produto.dto';
import { PdvCartService } from './../../../services/cart/pdv/pdv-cart.service';
import { StorageService } from './../../../services/auth/storage.service';
import { PageOrder } from './../../../constants/page.constant';
import { EstoqueService } from './../../../services/estoque/estoque.service';

@Component({
  selector: 'app-pdv-main',
  templateUrl: './pdv-main.component.html',
  styleUrls: ['./pdv-main.component.scss'],
})
export class PdvMainComponent implements OnInit, OnDestroy {
  loja_id: string;
  lojas: PageableDto<LojaDto>;
  currentLojasPage = 1;
  searchedLoja = '';

  estoques: PageableDto<EstoqueProduto>;
  sortNiveisHierarquicos: SelectItem[] = [];

  searchedProduto: string;
  selectedNivelHierarquico = '';
  selectedIsDescontado = '';
  currentPage = 1;

  items: MenuItem[] = [
    { label: 'Mais velho', command: () => { this.loadEstoques(this.currentPage, PageOrder.ASC) } },
    { label: 'Mais novo', command: () => { this.loadEstoques(this.currentPage, PageOrder.DESC) } },
  ];

  showAddDialog = false;
  quantidade: number;
  produtoToBeAdd: EstoqueProduto;

  private subscriptions = new Subscription();

  constructor(
    private readonly modal: ModalController,
    private readonly toastService: ToastMessageService,
    private readonly estoqueService: EstoqueService,
    private readonly storage: StorageService,
    private readonly pdvCartService: PdvCartService,
    private readonly menuController: MenuController,
    private readonly lojaService: LojaService,
  ) { }

  ngOnInit() {
    this.loja_id = this.storage.getCompleteLocalUser().loja.id;
    this.loadEstoques();
    this.loadLojas();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadLojas(page = 1, dropdown?: Dropdown) {
    const sub = this.lojaService.list(
      { searchedLoja: this.searchedLoja },
      { order: PageOrder.ASC, page, take: 10 })
      .subscribe(data => {
        this.lojas = data;
        if (dropdown) {
          dropdown.show();
        }
      });

    this.subscriptions.add(sub);
  }

  filterLoja(event) {
    const { filter } = event;

    event.originalEvent.preventDefault();
    event.originalEvent.stopImmediatePropagation();

    console.log(filter);
    if (!filter || filter.length < 3) {
      return;
    }

    this.searchedLoja = filter;
    this.loadLojas(1);
  }

  openMainMenu() {
    this.menuController.open();
  }

  changeNivelHierarquico({ value }) {
    this.selectedNivelHierarquico = value;
    if (value)
      this.loadEstoques(1);
  }

  clearFilter(event) {
    this.loadEstoques(1);
  }

  clearAllFilters(event, dropdown_tipoDesconto: Dropdown) {

    this.searchedProduto = undefined;
    this.selectedNivelHierarquico = undefined;

    dropdown_tipoDesconto.writeValue(null);

    this.loadEstoques(1);
  }

  loadEstoques(page = 1, order: PageOrder = PageOrder.ASC) {
    const sub = this.estoqueService.findProdutosByLoja(
      this.loja_id,
      { searchedProduto: this.searchedProduto },
      { order, page, take: 15 })
      .subscribe(response => {
        this.estoques = response;
      });
    this.subscriptions.add(sub);
  }

  detalhar(estoque: EstoqueProduto) {
    //this.showModal(estoqueDetailComponent, { estoque });
  }

  finalizar() {
    this.showModal(PdvFechamentoComponent, { selectedLoja: this.loja_id });
  }

  clearCart() {
    this.pdvCartService.clear();
  }

  search() {
    if (!this.searchedProduto || this.searchedProduto.trim().length <= 0) {
      this.searchedProduto = '';
      return;
    }
    this.loadEstoques(1);
  }

  clearSearch() {
    if (!this.searchedProduto || this.searchedProduto.trim().length <= 0) {
      this.searchedProduto = '';
      return;
    }
    this.searchedProduto = '';
    this.loadEstoques(1);
  }

  paginar(event) {
    const { first, rows } = event;
    const page = Number((Number(first) / Number(rows)) + 1);
    if (page != this.currentPage) {
      this.currentPage = page;
      this.loadEstoques(page);
    }
  }

  addQuantidade(estoque: EstoqueProduto) {
    const { quantidade } = estoque;
    if (quantidade <= 0) {
      this.toastService.presentToast({
        titulo: `Sem estoque`,
        detalhe: `O produto ${estoque.produto.nome} não possui estoque no momento`,
        duracao: ToastEnum.shortDuration,
        gravidade: ToastPrimeSeverityEnum.ATENCAO,
      }, 'down');
      return;
    }
    this.showAddDialog = true;
    this.produtoToBeAdd = estoque;
  }

  addCart() {
    const { produto, quantidade } = this.produtoToBeAdd;
    
    if (!this.quantidade || isNaN(this.quantidade) || this.quantidade <= 0) {
      return;
    }

    if (quantidade < this.quantidade) {
      this.toastService.presentToast({
        titulo: `Estoque insuficiente`,
        detalhe: `O produto possui apenas ${quantidade} itens em estoque no momento`,
        duracao: ToastEnum.shortDuration,
        gravidade: ToastPrimeSeverityEnum.ATENCAO,
      }, 'down');
      return;
    }

    this.pdvCartService.addProduto(this.produtoToBeAdd, this.quantidade);
    this.produtoToBeAdd = undefined;
    this.quantidade = undefined;
    this.showAddDialog = false;

    this.toastService.presentToast({
      titulo: `Adicionado!`,
      detalhe: `${produto.nome} adicionado ao carrinho`,
      duracao: ToastEnum.shortDuration,
      gravidade: ToastPrimeSeverityEnum.INFORMACAO,
    }, 'down');
  }

  removProduto(produto_id: string) {
    this.pdvCartService.removProduto(produto_id);
  }

  disableAddQuantidadeBtn() {
    return !this.quantidade || this.quantidade <= 0;
  }

  getQuantidadeItensCart() {
    const cart = this.pdvCartService.getCart();
    const quantidade = cart.pedido.item_produto.length
    if (quantidade <= 1) {
      return `${quantidade} item`;
    }
    return `${quantidade} itens`
  }

  getCart() {
    return this.pdvCartService.getCart();
  }

  private async showModal(
    component: ComponentRef,
    componentProps?: ComponentProps
  ) {
    const modal = await this.modal.create({
      component,
      backdropDismiss: false,
      cssClass: 'modal-size-100',
      componentProps,
    });

    modal.onDidDismiss().then((data) => {
      const { data: hasUpdate } = data;
      if (hasUpdate) {
        this.loadEstoques();
        this.toastService.presentToast({
          titulo: 'Sucesso',
          detalhe: 'Operação bem sucedida!',
          duracao: ToastEnum.mediumDuration,
          gravidade: ToastPrimeSeverityEnum.SUCESSO
        });
      }
    });

    return await modal.present();
  }
}
