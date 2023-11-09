
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ComponentRef, ComponentProps } from '@ionic/core';
import { FormBuilder } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { PedidoService } from './../../../../services/pedido/pedido.service';
import { PedidoDto } from './../../../../interfaces/pedidos/pedido.dto';
import { ToastPrimeSeverityEnum, ToastEnum } from './../../../../constants/toast.constant';
import { ToastMessageService } from './../../../../services/toast/toast-message.service';
import { cliente_nao_cadastrado_id } from '../../../../../shared/constants/system.constant';
import { FuncionarioProfileComponent } from '../../../adm-recurso-module/funcionarios/funcionario-profile/funcionario-profile.component';

@Component({
  selector: 'app-pedido-detail',
  templateUrl: './pedido-detail.component.html',
  styleUrls: ['./pedido-detail.component.scss'],
})
export class PedidoDetailComponent implements OnInit, OnDestroy {

  @Input()
  id: string;

  @Input()
  pedido: PedidoDto;

  private subscriptions = new Subscription();

  constructor(
    private readonly modalCrtl: ModalController,
    private readonly toastService: ToastMessageService,
    private readonly pedidoService: PedidoService,
  ) {
  }

  ngOnInit() {
    if (this.id) {
      this.findById();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  findById() {
    const sub = this.pedidoService.findById(this.id)
      .subscribe({
        next: (data) => {
          this.pedido = data;
        }
      });
    this.subscriptions.add(sub);
  }

  openJustificativa() {
    const { acrescimo_desconto, descricao } = this.pedido;

    if (!acrescimo_desconto || acrescimo_desconto == 0) {
      this.toastService.presentToast({
        titulo: `Sem acŕescimo/desconto`,
        detalhe: `O pedido não teve acréscimo ou descontos`,
        duracao: ToastEnum.shortDuration,
        gravidade: ToastPrimeSeverityEnum.ATENCAO,
      });
      return;
    }

    if (acrescimo_desconto && !descricao) {
      this.toastService.presentToast({
        titulo: `Acŕescimo/desconto sem justificativa`,
        detalhe: `O colaborador ${this.pedido.vendedor.nome} não colocou uma justificativa`,
        duracao: ToastEnum.shortDuration,
        gravidade: ToastPrimeSeverityEnum.ERRO,
      });
      //SUBIR OVERLAY DE CONTIGENCIA
      return;
    }

    this.toastService.presentInfoOverlay({
      data: descricao,
      footer: '-',
    });
  }

  openCliente() {
    const { cliente } = this.pedido;
    if (cliente.id == cliente_nao_cadastrado_id) {
      this.toastService.presentToast({
        titulo: `Não cadastrado`,
        detalhe: `Cliente não identificado ou cadastrado`,
        duracao: ToastEnum.shortDuration,
        gravidade: ToastPrimeSeverityEnum.ATENCAO,
      });
      return;
    }
    //TODO abrir tela com a dashboard do cliente
  }

  openColaborador() {
    const { vendedor } = this.pedido;
    this.showModal(FuncionarioProfileComponent, { user: vendedor });
  }

  openLoja() {
    const { loja } = this.pedido;
    //TODO abrir tela com a dashboard da loja
  }

  downloadNF() {
    //TODO baixar NF
  }

  refresh() {
    const { id } = this.pedido;
    const sub = this.pedidoService.findById(id)
      .subscribe(data => {
        this.pedido = data;
      });

    this.subscriptions.add(sub);
  }

  fechar() {
    this.modalCrtl.dismiss();
  }

  private async showModal(
    component: ComponentRef,
    componentProps?: ComponentProps
  ) {
    const modal = await this.modalCrtl.create({
      component,
      backdropDismiss: false,
      cssClass: 'modal-size-100',
      componentProps,
      id: 'funcionario-dashboard'
    });


    return await modal.present();
  }

}
