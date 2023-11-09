
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { ProdutoDto } from './../../../../interfaces/produtos/produto.dto';
import { CargaNome } from './../../../../interfaces/carga-dados/carga-dados.dto';
import { EstoqueService } from './../../../../services/estoque/estoque.service';
import { OperationType } from '../../../../../../app/shared/constants/estoque.constant';
import { ToastMessageService } from './../../../../services/toast/toast-message.service';
import { ProdutoService } from './../../../../services/produto/produto.service';
import { ToastEnum, ToastPrimeSeverityEnum } from './../../../../constants/toast.constant';
import { LojaNaoCadastradaDto } from '../../../../../shared/interfaces/estoques/estoque.dto';

@Component({
  selector: 'app-estoque-view',
  templateUrl: './estoque-view.component.html',
  styleUrls: ['./estoque-view.component.scss'],
})
export class EstoqueViewComponent implements OnInit, OnDestroy {

  @Input()
  produto: ProdutoDto

  isLoaded = false;

  showOperationDialog = false;
  operationTitle: string;
  operationType: string;
  operationValue = 0;
  selectedLojaId: string;
  wasCreated = false;

  showLojaListDialog = false;
  selectedLoja: string;
  listLojas: LojaNaoCadastradaDto[] = [];

  private subscriptions = new Subscription();

  constructor(
    private readonly modal: ModalController,
    private readonly router: Router,
    private readonly estoqueService: EstoqueService,
    private readonly produtoService: ProdutoService,
    private readonly toastMessageService: ToastMessageService,
  ) { }

  ngOnInit() {
    this.orderEstoque();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  liberateEstoqueView() {
    return !(this.produto && this.produto.estoques.length <= 0);
  }

  redirectCarga() {
    const extras: NavigationExtras = {
      queryParams: {
        tab: 'carregar',
        option: CargaNome.CARGA_ESTOQUE
      },
    };
    this.fechar();
    this.router.navigate(['/carga-dados'], extras);
  }

  decrementarEstoque(lojaId: string) {
    this.showOperationDialog = true;
    this.operationTitle = 'Remover do estoque';
    this.operationType = OperationType.DECREMENTAR;
    this.selectedLojaId = lojaId;
  }

  incrementarEstoque(lojaId: string) {
    this.showOperationDialog = true;
    this.operationTitle = 'Acrescentar no estoque';
    this.operationType = OperationType.INCREMENTAR;
    this.selectedLojaId = lojaId;
  }

  update() {
    switch (this.operationType) {
      case OperationType.INCREMENTAR:
        this.estoqueService.entradaEstoque({
          loja_id: this.selectedLojaId,
          produto_id: this.produto.id,
          quant_entrada: Number(this.operationValue),
        })
          .subscribe(response => {
            this.loadProduto();
          });
        break;

      case OperationType.DECREMENTAR:
        this.estoqueService.saidaEstoque({
          loja_id: this.selectedLojaId,
          produto_id: this.produto.id,
          quant_saida: Number(this.operationValue),
        })
          .subscribe(response => {
            this.loadProduto();
          });
        break;

      default:
        this.toastMessageService.presentToast({
          detalhe: `Tipo de operação inválida.`,
          duracao: ToastEnum.shortDuration,
          gravidade: ToastPrimeSeverityEnum.ATENCAO,
          titulo: `Inválido!`
        });
    }
  }

  loadProduto() {
    const { id } = this.produto;
    this.produtoService.findById(id)
      .subscribe(response => {
        this.produto = response;
        this.orderEstoque();
        this.operationValue = 0;
        this.showOperationDialog = false;
        this.showLojaListDialog = false;
        this.selectedLojaId = undefined;
        this.wasCreated = true;
        this.toastMessageService.presentToast({
          detalhe: `Estoque da loja atualizado.`,
          duracao: ToastEnum.shortDuration,
          gravidade: ToastPrimeSeverityEnum.SUCESSO,
          titulo: `Sucesso!`
        });
      });
  }

  listLojasSemProduto() {
    this.selectedLojaId = undefined;
    this.estoqueService.listLojasSemProdutoX(this.produto.id)
      .subscribe(data => {
        this.showLojaListDialog = true;
        this.listLojas = data;
      });
  }

  createEstoque() {
    this.estoqueService.createEstoque({
      loja_id: this.selectedLojaId,
      produto_id: this.produto.id,
    })
    .subscribe(response => {
      this.loadProduto();
    });
  }

  disableUpdateBtn(){
    return !this.operationValue ;
  }

  disableCreateBtn(){
    return !this.selectedLojaId ;
  }

  fechar() {
    this.modal.dismiss(this.wasCreated, 'estoque');
  }

  private orderEstoque() {
    if (!this.produto.estoques) {
      return;
    }
    this.produto.estoques = this.produto.estoques.sort((x, y) => {
      return x.loja.codigo > y.loja.codigo ? 1 : y.loja.codigo > x.loja.codigo ? -1 : 0
    });
  }

}
