import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { FileUpload } from 'primeng/fileupload';
import { saveAs } from 'file-saver';
import { Subscription } from 'rxjs';

import { FileTemplateCargas } from 'src/app/shared/constants/file-templates.constant';
import { ToastEnum, ToastPrimeSeverityEnum } from 'src/app/shared/constants/toast.constant';
import { CargaDadosList, CargaListConst, CargaNome } from 'src/app/shared/interfaces/carga-dados/carga-dados.dto';
import { CargaDadosService } from 'src/app/shared/services/carga-dados/carga-dados.service';
import { DownloadTemplateCargasService } from 'src/app/shared/services/central-download/templates/cargas/cargas.service';
import { ToastMessageService } from 'src/app/shared/services/toast/toast-message.service';

@Component({
  selector: 'app-carga-produtos-upload',
  templateUrl: './carga-produtos-upload.component.html',
  styleUrls: ['./carga-produtos-upload.component.scss'],
})
export class CargaProdutosUploadComponent implements OnInit, OnDestroy {

  @Input('glow-option')
  glowOption: string;

  cargaList: CargaDadosList[] = CargaListConst;
  private subscriptions = new Subscription();

  constructor(
    private readonly toastMessageService: ToastMessageService,
    private readonly cargaDadosService: CargaDadosService,
    private readonly downloadTemplateCargasService: DownloadTemplateCargasService,
  ) { }

  ngOnInit() {
   }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  downloadTemplate(carga: CargaDadosList) {
    switch (carga.nome_carga) {
      case CargaNome.CARGA_ESTOQUE:
        this.doDownload(FileTemplateCargas.CARGA_ESTOQUES);
        break;

      case CargaNome.CARGA_PRODUTOS:
        this.doDownload(FileTemplateCargas.CARGA_PRODUTOS);
        break;
    }
  }

  doDownload(id: FileTemplateCargas) {
    const sub = this.downloadTemplateCargasService.findCargaTemplate(id)
      .subscribe((response) => {
        const fileName = response.headers.get('file-name') || 'template.csv';
        saveAs(response.body, fileName);

        this.toastMessageService.presentToast({
          detalhe: 'Baixando template', duracao: ToastEnum.shortDuration,
          gravidade: ToastPrimeSeverityEnum.SUCESSO, titulo: 'Download em andamento'
        });
      });
    this.subscriptions.add(sub);
  }

  uploadFile(event, carga: CargaDadosList, fileUpload: FileUpload) {
    switch (carga.nome_carga) {
      case CargaNome.CARGA_ESTOQUE:
        this.uploadCargaEstoque(event, fileUpload);
        break;

      case CargaNome.CARGA_PRODUTOS:
        this.uploadCargaProduto(event, fileUpload);
        break;
    }
  }

  uploadCargaProduto(event, fileUpload: FileUpload) {
    const file = event.files[0];

    const sub = this.cargaDadosService.carregarProdutos(file)
      .subscribe(response => {
        this.toastMessageService.presentToast({
          detalhe: 'Carga enviada', duracao: ToastEnum.shortDuration,
          gravidade: ToastPrimeSeverityEnum.SUCESSO, titulo: 'Enviada!'
        });
        fileUpload.clear();
      });
    this.subscriptions.add(sub);
  }

  uploadCargaEstoque(event, fileUpload: FileUpload) {
    const file = event.files[0];

    const sub = this.cargaDadosService.carregarEstoques(file)
      .subscribe(response => {
        this.toastMessageService.presentToast({
          detalhe: 'Carga enviada', duracao: ToastEnum.shortDuration,
          gravidade: ToastPrimeSeverityEnum.SUCESSO, titulo: 'Enviada!'
        });
        fileUpload.clear();
      });
    this.subscriptions.add(sub);
  }

  shouldGlow(carga: CargaDadosList){
    const result = this.glowOption == carga.nome_carga;
    return result;
  }

}
