import { SelectItem } from 'primeng/api';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';

import { ToastMessageService } from './../../../../services/toast/toast-message.service';
import { PageableDto } from './../../../../interfaces/others/pageable.dto';
import { PageOrder } from './../../../../constants/page.constant';
import { ProdutoService } from './../../../../services/produto/produto.service';
import { ProdutoDto, RequestEstoqueCreationDto } from './../../../../interfaces/produtos/produto.dto';

@Component({
  selector: 'app-select-products',
  templateUrl: './select-products.component.html',
  styleUrls: ['./select-products.component.scss'],
})
export class SelectProductsComponent implements OnInit, OnDestroy {

  @Output()
  selectedProdutosEvent: EventEmitter<any> = new EventEmitter();


  produtos: PageableDto<ProdutoDto>;
  sortOptions: SelectItem[] = [];
  searchedNome: string = '';
  currentPage = 1;
  selectAll: boolean = false;
  selectedProdutos: RequestEstoqueCreationDto[] = [];
  totalRecords = 0;

  isLoaded = false;
  private subscriptions = new Subscription();

  constructor(
    private readonly modal: ModalController,
    private readonly toastMessageService: ToastMessageService,
    private readonly produtoService: ProdutoService,
  ) { }

  ngOnInit() {
    this.loadProdutos();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadProdutos(page: number = 1, nome = undefined) {
    const sub = this.produtoService.list({ nome }, { order: PageOrder.DESC, page, take: 10 })
      .subscribe(data => {
        this.produtos = data;
        const newData = this.produtos.data.map(p => {
          const requestEstoqueDto: RequestEstoqueCreationDto = {
            produto_id: p.id,
            quant_entrada: 0,
            descricao: p.descricao,
            nome: p.nome,
          }
          return requestEstoqueDto;
        })
        this.produtos.data = newData as any;
        this.totalRecords = data.meta.itemCount;
        this.isLoaded = true;
      });

    this.subscriptions.add(sub);
  }

  paginar(event) {
    const { first, rows } = event;
    const page = Number((Number(first) / Number(rows)) + 1);
    this.currentPage = page;
    this.loadProdutos(page);
  }


  search() {
    this.loadProdutos(1, this.searchedNome);
  }

  clear() {
    this.searchedNome = '';
    this.loadProdutos(1, this.searchedNome);
  }

  onSelectionChange(value = []) {
    this.selectAll = value.length === this.totalRecords;
    this.selectedProdutos = value;
  }

  onSelectAllChange(event) {
    const checked = event.checked;
    if (checked) {
      const sub = this.produtoService.list({}, { order: PageOrder.DESC, page: this.currentPage, take: 10 })
        .subscribe(data => {
          this.produtos = data;
          this.selectAll = true;
        });
    }
    else {
      this.selectedProdutos = [];
      this.selectAll = false;
    }
  }

  updateQuantidade({value: quant_entrada}, p: RequestEstoqueCreationDto){
    p.quant_entrada = quant_entrada? quant_entrada: 0;
    const i = this.selectedProdutos.findIndex(selectedProduto => selectedProduto.produto_id == p.produto_id);
    this.selectedProdutos[i] = p;
  }
  disableInputNumber(p: RequestEstoqueCreationDto){
    return !this.selectedProdutos.includes(p);
  }

  disableNext(){
    return this.selectedProdutos.length < 1;
  }

  next() {
    this.selectedProdutosEvent.emit(this.selectedProdutos);
  }

}
