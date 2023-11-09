import { Dropdown } from 'primeng/dropdown';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { StatusUser } from './../../../constants/status.constant';
import { ToastMessageService } from './../../../services/toast/toast-message.service';
import { PageableDto } from './../../../interfaces/others/pageable.dto';
import { PageOrder } from './../../../constants/page.constant';
import { TipoUsuarioEnum } from '../../../../shared/constants/tipo-user.constant';
import { UserService } from './../../../services/user/user.service'
import { LojaBasicDto } from './../../../interfaces/lojas/loja.dto';
import { UserDto } from './../../../interfaces/users/user.dto';
import { PdvCartService } from './../../../services/cart/pdv/pdv-cart.service';
import { StorageService } from './../../../services/auth/storage.service';
import { PagamentoFormasMenu } from '../../../../shared/constants/pagamento-formas.constant';
import { OpcoesAcrescimoDesconto, OpcoesAcrescimoDescontoEnum, OpcoesTipo, OpcoesTipoEnum } from '../../../../shared/constants/descontos.constant';
import { CreateItemProdutoDto } from './../../../interfaces/itens-produto/item-produto.dto';
import { PdvCartDto } from './../../../interfaces/cart/cart.dto';
import { PedidoUtils } from '../../../../shared/utils/PedidoUtils';
import { PedidoService } from './../../../services/pedido/pedido.service';
import { CreatePedidoDto } from './../../../interfaces/pedidos/pedido.dto';

@Component({
  selector: 'app-pdv-fechamento',
  templateUrl: './pdv-fechamento.component.html',
  styleUrls: ['./pdv-fechamento.component.scss'],
})
export class PdvFechamentoComponent implements OnInit, OnDestroy {
  // TODO: Adicionar opcao de acrescimo/desconto
  // Criar o pedido
  @Input()
  selectedLoja: string;
  searchedNome = '';
  selectedClient;

  clients: PageableDto<UserDto>;
  currentClientPage = 1;
  funcionario: UserDto;
  loja: LojaBasicDto;
  cart: PdvCartDto;

  form: UntypedFormGroup;
  formasPagamento = PagamentoFormasMenu;
  selectedFormaPagamento;
  opcoesAcrescimoDesconto = OpcoesAcrescimoDesconto;
  selectedOpcaoAcrescimoDesconto = OpcoesAcrescimoDescontoEnum.NAO;
  opcoesTipo = OpcoesTipo;
  selectedOpcaoTipo

  createdId = '';
  wasCreated = false;


  private subscriptions = new Subscription();

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly modal: ModalController,
    private readonly userService: UserService,
    private readonly storage: StorageService,
    private readonly pdvCartService: PdvCartService,
    private readonly pedidoService: PedidoService
  ) { }

  ngOnInit() {
    this.loadClients();
    this.loadCart();

    this.funcionario = this.storage.getCompleteLocalUser();
    this.loja = this.funcionario.loja;

    this.form = this.formBuilder.group({
      pagamento_forma: [, [Validators.required,]],
      vendedor_id: [this.funcionario.id, [Validators.required,]],
      loja_id: [this.loja.id, [Validators.required,]],
      acrescimo_desconto: [, []],
      descricao: [, []],
    });

  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadClients(page = 1, dropdown?: Dropdown) {
    const sub = this.userService.listUsers(
      { searchedUser: this.searchedNome, tipo_usuario: TipoUsuarioEnum.CLIENTE },
      { order: PageOrder.DESC, page, take: 10 }
    )
      .subscribe(response => {
        this.clients = response;
        if (dropdown) {
        }
      });
    this.subscriptions.add(sub);
  }

  paginarClient(event) {
    this.loadClients();
  }

  onClientFilter(event) {
    const filter = event.filter as string;
    this.searchedNome = filter;
  }

  blurClient(event, dropdown: Dropdown){
    this.searchedNome = undefined;
    dropdown.filterValue = undefined;
  }

  cadastrarCliente() {
  }

  selectFormaPagamento() {
    const formaPagamento = this.form.get('pagamento_forma').value;
    this.selectedFormaPagamento = formaPagamento;
  }

  selectFormaPagamentoDiv(f) {
    this.form.get('pagamento_forma').setValue(f.value);
    this.selectedFormaPagamento = f.value;
  }

  //Cart
  loadCart() {
    this.cart = this.pdvCartService.getCart();
  }

  getTotalItens() {
    return this.cart.pedido.item_produto.length;
  }

  getSubTotal() {
    return this.cart.total;
  }

  getTotal() {
    return Number(this.cart.total) + Number(this.getDescontoAcrescimo());
  }

  changeQuantidade(item: CreateItemProdutoDto) {
    if (item.quantidade <= 0) {
      this.removProduto(item.produto_id);
      return;
    }
    this.pdvCartService.changeQuantidade(item.produto_id, item.quantidade);
  }

  removProduto(produto_id: string) {
    this.pdvCartService.removProduto(produto_id);
  }

  getLoad() {
    return this.clients && this.cart && this.cart.pedido.item_produto.length > 0;
  }

  disableOpcoesTipo() {
    return this.selectedOpcaoAcrescimoDesconto && this.selectedOpcaoAcrescimoDesconto != OpcoesAcrescimoDescontoEnum.NAO;
  }

  listenOpcaoAcrescimoDesconto() {
    if (this.selectedOpcaoAcrescimoDesconto == OpcoesAcrescimoDescontoEnum.NAO) {
      this.selectedOpcaoTipo = undefined;
      this.form.get('acrescimo_desconto').setValue(undefined);

      this.form.get('acrescimo_desconto').clearValidators();
      this.form.get('descricao').clearValidators();
    } else {
      this.form.get('acrescimo_desconto').setValidators([Validators.required]);
      this.form.get('descricao').setValidators([Validators.required, Validators.minLength(5)]);
    }

    this.form.get('acrescimo_desconto').updateValueAndValidity();
    this.form.get('descricao').updateValueAndValidity();
  }

  listenOpcoesTipoChange() {
    this.form.get('acrescimo_desconto').setValue(undefined);
  }

  getDescontoAcrescimo() {
    let acrescimo_desconto = this.form.get('acrescimo_desconto').value;
    if (!acrescimo_desconto || acrescimo_desconto == 0) {
      return 0;
    }

    if (this.selectedOpcaoTipo == OpcoesTipoEnum.PERCENTUAL) {
      acrescimo_desconto = this.cart.total * (acrescimo_desconto / 100);
    }

    if (this.selectedOpcaoAcrescimoDesconto == OpcoesAcrescimoDescontoEnum.DESCONTO) {
      acrescimo_desconto = acrescimo_desconto * -1;
    }

    return Number(acrescimo_desconto);
  }

  getDescontoAcrescimoTxt() {
    const valor = this.getDescontoAcrescimo();
    if (!valor || valor == 0) {
      return ' -';
    }
    return valor < 0 ? `(-) ${(valor * -1)}` : `(+) ${valor}`;
  }


  finalizarPedido() {
    const pagamento_forma = this.form.get('pagamento_forma').value;
    const vendedor_id = this.form.get('vendedor_id').value;
    const loja_id = this.form.get('loja_id').value;
    const descricao = this.form.get('descricao').value;
    const acrescimo_desconto = this.form.get('acrescimo_desconto').value;
    const item_produto = this.pdvCartService.getItemProduto();

    let pedido: CreatePedidoDto = {
      pagamento_forma,
      vendedor_id,
      loja_id,
      descricao,
      item_produto,
    }

    pedido = PedidoUtils.setAcrescimoDesconto(
      this.selectedOpcaoAcrescimoDesconto,
      this.selectedOpcaoTipo,
      pedido,
      acrescimo_desconto
    );

    this.pedidoService.create(pedido, true)
      .subscribe(data => {
        this.pdvCartService.clear();
        this.createdId = data.id;
        this.wasCreated = true;
        this.fechar();
      })
  }

  disabledCreatePedido(): boolean {
    const situacao = !this.form.valid;
    return situacao;
  }


  fechar() {
    this.modal.dismiss(this.wasCreated);
  }

}
