
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { FileUpload } from 'primeng/fileupload';

import { ProdutoService } from './../../../../services/produto/produto.service';
import { ToastMessageService } from './../../../../services/toast/toast-message.service';
import { ToastEnum, ToastPrimeSeverityEnum } from './../../../../constants/toast.constant';

@Component({
  selector: 'app-produto-cadastro',
  templateUrl: './produto-cadastro.component.html',
  styleUrls: ['./produto-cadastro.component.scss'],
})
export class ProdutoCadastroComponent implements OnInit, OnDestroy {

  form: UntypedFormGroup;
  isLoaded = false;

  createdProdutoId = '';
  wasCreated = false;
  imagem_principal_id: string;

  private subscriptions = new Subscription();

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly produtosService: ProdutoService,
    private readonly modal: ModalController,
    private readonly toastService: ToastMessageService,
  ) {

    this.form = this.formBuilder.group({
      nome: [, [Validators.required]],
      descricao: [, [Validators.required,]],
      preco_compra: [, [Validators.required,]],
      preco_venda: [, [Validators.required,]],
    });
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  create() {
    const nome = this.form.get('nome').value;
    const descricao = this.form.get('descricao').value;
    const preco_compra = this.form.get('preco_compra').value;
    const preco_venda = this.form.get('preco_venda').value;

    const sub = this.produtosService.create({ nome, descricao, preco_compra, preco_venda, imagem_principal_id: this.imagem_principal_id })
      .subscribe(data => {
        this.createdProdutoId = data.id;
        this.wasCreated = true;
        this.fechar();
      });

    this.subscriptions.add(sub);
  }


  //#region ANEXOS
  anexarImagemPrincipal(event, fileUpload: FileUpload) {
    const file = event.files[0];
    fileUpload.clear();
    this.produtosService.createImagemPrincipal(file)
      .subscribe({
        next: (data) => {
          const { id: imagem_principal_id } = data;
          this.imagem_principal_id = imagem_principal_id;

          this.toastService.presentToast({
            detalhe: `Imagem anexada!`,
            duracao: ToastEnum.mediumDuration,
            gravidade: ToastPrimeSeverityEnum.SUCESSO,
            titulo: `Sucesso!`
          });
        },
      })
  }

  get imagemPrincipalId() {
    return this.imagem_principal_id;
  }
  //#endregion

  fechar() {
    this.modal.dismiss(this.wasCreated);
  }

  isInputError(inputName: string): boolean {
    const resp =
      !this.form.controls[inputName].untouched &&
      this.form.controls[inputName].errors;

    if (resp) {
      return true;
    }
    return false;
  }

  disableCreateBtn(): boolean {
    const situacao = !this.form.valid;

    return situacao;
  }

}
