import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ComponentProps, ComponentRef } from '@ionic/core';

import { SelectItem } from 'primeng/api';
import { Subscription } from 'rxjs';

import { CargaNomeEnum } from 'src/app/shared/constants/carga.constant';
import { CoverImgs } from 'src/app/shared/constants/images.constant';
import { PageOrder } from 'src/app/shared/constants/page.constant';
import { CargaStatus } from 'src/app/shared/constants/status.constant';
import { CargaDadosDto, CargaDadosList } from 'src/app/shared/interfaces/carga-dados/carga-dados.dto';
import { PageableDto } from 'src/app/shared/interfaces/others/pageable.dto';
import { StorageService } from 'src/app/shared/services/auth/storage.service';
import { CargaDadosService } from 'src/app/shared/services/carga-dados/carga-dados.service';
import { CargaEstoquesDetailComponent } from '../carga-estoques-detail/carga-estoques-detail.component';
import { CargaProdutosDetailComponent } from '../carga-produtos-detail/carga-produtos-detail.component';

@Component({
  selector: 'app-carga-produtos-main',
  templateUrl: './carga-produtos-main.component.html',
  styleUrls: ['./carga-produtos-main.component.scss'],
})
export class CargaProdutosMainComponent implements OnInit, OnDestroy {

  cargaDados: PageableDto<CargaDadosDto>;
  sortOptions: SelectItem[] = [];
  selectedStatus: string;
  currentPage = 1;

  isLoaded = false;
  currentLotericaLoaded: string;
  cargaList: SelectItem[] = [];
  selectedCarga: string;

  private subscriptions = new Subscription();

  constructor(
    private readonly cargaDadosService: CargaDadosService,
    private readonly storage: StorageService,
    private readonly modal: ModalController,
  ) { }

  ngOnInit() {
    this.sortOptions = [
      { label: 'Tudo', value: undefined },
      { label: 'Concluído', value: CargaStatus.CONCLUIDO },
      { label: 'Em execução', value: CargaStatus.EM_EXECUCAO },
      { label: 'Falha', value: CargaStatus.FALHA },
    ];
    this.loadCargaList();
    this.loadCargas();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  changeStatus(event) {
    this.loadCargas();
  }

  paginar(event) {
    const { first, rows } = event;
    const page = Number((Number(first) / Number(rows)) + 1);
    if (page != this.currentPage) {
      this.currentPage = page;
      this.loadCargas(page);
    }

  }

  loadCargas(page: number = 1) {
    const sub = this.cargaDadosService.search(
      {
        user_id: this.storage.getLocalUser().id,
        status: this.selectedStatus,
        nome_carga: this.selectedCarga,
      },
      { order: PageOrder.DESC, page, take: 5 }
    )
      .subscribe(page => {
        this.cargaDados = page;
        this.isLoaded = true;
      });
    this.subscriptions.add(sub);
  }

  loadCargaList() {
    this.cargaDadosService.getCargasList()
      .subscribe(data => {
        this.cargaList = [];
        this.cargaList.push({ label: 'Tudo', value: undefined });
        const carga = data.map(d => {
          return {
            label: d.nome_carga,
            value: d.nome_carga
          }
        });
        this.cargaList.push(...carga);
      });
  }

  getDefaultCargaImg(carga: CargaDadosDto) {
    switch (carga.nome_job) {
      case CargaNomeEnum.CARGA_ESTOQUE:
        return CoverImgs.CARGA_ESTOQUE;

      case CargaNomeEnum.CARGA_PRODUTO:
        return CoverImgs.CARGA_PRODUTO;
    }
  }

  detalhar(carga: CargaDadosDto) {
    switch (carga.nome_job) {
      case CargaNomeEnum.CARGA_ESTOQUE:
        this.showModal(CargaEstoquesDetailComponent, { carga });
        break;

      case CargaNomeEnum.CARGA_PRODUTO:
        this.showModal(CargaProdutosDetailComponent, { carga });
        break;
    }

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

      });

    return await modal.present();
  }

}
