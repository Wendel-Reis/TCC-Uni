
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ComponentProps, ComponentRef } from '@ionic/core';
import { NavigationExtras, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';

import { FileUtils } from './../../../../utils/FileUtils';
import { PedidoService } from './../../../../services/pedido/pedido.service';
import { ToastMessageService } from './../../../../services/toast/toast-message.service';
import { PageableDto } from './../../../../interfaces/others/pageable.dto';
import { ToastEnum, ToastPrimeSeverityEnum } from './../../../../constants/toast.constant';
import { PageOrder } from './../../../../constants/page.constant';
import { PedidoDto } from './../../../../interfaces/pedidos/pedido.dto';
import { PedidoDetailComponent } from '../pedido-detail/pedido-detail.component';
import { LojaService } from './../../../../services/loja/loja.service';
import { LocalPedido, LocalPedidoEnum, StatusPedido, StatusPedidoEnum } from './../../../../constants/status-pedido.constant';
import { UserDto } from './../../../../interfaces/users/user.dto';
import { UserService } from './../../../../services/user/user.service';
import { FuncionarioProfileComponent } from '../../../adm-recurso-module/funcionarios/funcionario-profile/funcionario-profile.component';

@Component({
  selector: 'app-pedido-main',
  templateUrl: './pedido-main.component.html',
  styleUrls: ['./pedido-main.component.scss'],
})
export class PedidoMainComponent implements OnInit, OnDestroy {

  pedidos: PageableDto<PedidoDto>;
  searchedPedido = '';

  searchedLoja: string;
  sortLojas: SelectItem[] = [];

  colaboradores: PageableDto<UserDto>;
  searchedColaborador: string;

  clientes: PageableDto<UserDto>;
  searchedCliente: string;

  selectedStatus: StatusPedidoEnum;
  sortStatus: SelectItem[] = [];

  selectedLocal: LocalPedidoEnum;
  sortLocais: SelectItem[] = [];

  currentPage = 1;
  pageOrder = PageOrder.DESC;
  currentTake = 5;

  min_total: number = 0;
  max_total: number = 0;
  selectedDate: Date;

  cols: any[];
  exportColumns: any[];
  selectedPedidos: PedidoDto[] = [];

  private subscriptions = new Subscription();

  constructor(
    private readonly pedidoService: PedidoService,
    private readonly modal: ModalController,
    private readonly toastService: ToastMessageService,
    private readonly router: Router,
    private readonly lojaService: LojaService,
    private readonly userService: UserService,
  ) { }

  ngOnInit() {
    this.sortStatus = [...StatusPedido];
    this.sortLocais = [...LocalPedido];

    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'loja.nome', header: 'Loja' },
      { field: 'cliente.nome', header: 'Cliente' },
      { field: 'vendedor.nome', header: 'Vendedor' },
      { field: 'total_pedido', header: 'Total do Pedido' },
      { field: 'status_pedido', header: 'Status' },
      { field: 'from_pdv', header: 'Local' },
      { field: 'created_at', header: 'Data de Criação' }
    ];

    this.exportColumns = this.cols.map(col => {
      return { title: col.header, dataKey: col.field };
    });

    this.loadPedidos();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadPedidos(page: number = 1, dt?: Table) {

    const sub = this.pedidoService.list({
      searchedPedido: this.searchedPedido,
      searchedLoja: this.searchedLoja,
      status_pedido: this.selectedStatus,
      local: this.selectedLocal,
      searchedCliente: this.searchedCliente,
      searchedVendedor: this.searchedColaborador,
      min_total: Number(this.min_total),
      max_total: Number(this.max_total),
      created_at: this.selectedDate,
    },
      { order: this.pageOrder, page, take: this.currentTake })
      .subscribe(data => {
        this.pedidos = data;
      },
        () => { },
        () => {
          if (dt) {
            dt.paginator = true;
          }
        }
      );

    this.subscriptions.add(sub);
  }

  paginar(event, dt: Table) {
    // this.pedidos = undefined;
    dt.paginator = false;
    const { first, rows, sortOrder } = event;
    const page = Number((Number(first) / Number(rows)) + 1);
    this.doFilter(event);

    this.currentPage = page;
    this.currentTake = rows;
    this.pageOrder = sortOrder && sortOrder == 1 ? PageOrder.DESC : PageOrder.ASC;

    this.loadPedidos(page, dt);
  }

  doFilter(event) {
    if (!event || !event.filters || !event.filters.id) {
      return;
    }
    const { id, cliente, vendedor, created_at, loja, status, local } = event.filters;
    if (this.min_total > this.max_total) {
      this.max_total = undefined;
    }

    if (id[0].value) {
      this.searchedPedido = id[0].value;
    } else {
      this.searchedPedido = undefined;
    }

    if (cliente[0].value) {
      this.searchedCliente = cliente[0].value;
    } else {
      this.searchedCliente = undefined;
    }

    if (vendedor[0].value) {
      this.searchedColaborador = vendedor[0].value;
    } else {
      this.searchedColaborador = undefined;
    }

    if (status[0].value) {
      this.selectedStatus = status[0].value;
    } else {
      this.selectedStatus = undefined;
    }

    if (local[0].value) {
      this.selectedLocal = local[0].value;
    } else {
      this.selectedLocal = undefined;
    }

    if (created_at[0].value) {
      this.selectedDate = created_at[0].value;
    } else {
      this.selectedDate = undefined;
    }

    if (loja[0].value) {
      this.searchedLoja = loja[0].value;
    } else {
      this.searchedLoja = undefined;
    }

  }

  clearTotal() {
    this.min_total = undefined;
    this.max_total = undefined;
    this.loadPedidos(1);
  }

  exportPdf() {
    const fileName = `Pedidos - ${new Date().toLocaleDateString()}`;
    const head = this.cols.map(c => c.header);
    const body = this.convertPedidoData().map(Object.values);


    FileUtils.exportPdf(fileName, head, body);
  }

  exportExcel() {
    const fileName = `Pedidos - ${new Date().toLocaleDateString()}`;
    FileUtils.exportExcel(fileName, this.convertPedidoData());
  }

  exportCsv() {
    const fileName = `Pedidos - ${new Date().toLocaleDateString()}`;
    FileUtils.exportCSV(fileName, this.convertPedidoData());
  }

  doCancelamento(pedido: PedidoDto) {
    //TODO
  }

  detail(pedido: PedidoDto) {
    this.showModal(PedidoDetailComponent, { pedido });
  }

  openColaborador(user_id: string) {
    this.showModal(FuncionarioProfileComponent, { user_id });
  }

  openCliente(user_id: string) {
   //this.showModal(ClienteProfileComponent, { user_id });
  }

  private convertPedidoData() {
    const data = this.pedidos.data.map(p => {
      return {
        id: p.id,
        loja: p.loja.nome,
        cliente: p.cliente.nome,
        vendedor: p.vendedor.nome,
        total_pedido: p.total_pedido,
        status: p.status_pedido,
        local: p.from_pdv ? LocalPedidoEnum.PDV : LocalPedidoEnum.E_COMMERCE,
        data_criacao: new Date(p.created_at).toLocaleDateString(),
      }
    });

    return data;
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

    modal.onDidDismiss()
      .then((data) => {
        const { data: hasUpdate, role } = data;

        if (hasUpdate) {
          this.loadPedidos(this.currentPage);
          this.toastService.presentToast({
            detalhe: `Operação bem sucedida!`,
            titulo: `Sucesso!`,
            duracao: ToastEnum.mediumDuration,
            gravidade: ToastPrimeSeverityEnum.SUCESSO
          });
        }

      });

    return await modal.present();
  }
}
