import { ToastEnum, ToastPrimeSeverityEnum } from './../../../../constants/toast.constant';
import { ToastMessageService } from './../../../../services/toast/toast-message.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ProdutoDto } from '../../../../../shared/interfaces/produtos/produto.dto';
import { ProdutoService } from '../../../../../shared/services/produto/produto.service';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-produto-detail',
  templateUrl: './produto-detail.component.html',
  styleUrls: ['./produto-detail.component.scss'],
})
export class ProdutoDetailComponent implements OnInit, OnDestroy {

  @Input()
  produto: ProdutoDto;

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

  }

  ngOnInit() {
    const { nome, descricao, preco_compra, preco_venda } = this.produto;

    this.form = this.formBuilder.group({
      nome: [nome, [Validators.required]],
      descricao: [descricao, [Validators.required,]],
      preco_compra: [preco_compra, [Validators.required,]],
      preco_venda: [preco_venda, [Validators.required,]],
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  update() {
    const { id } = this.produto;
    const nome = this.form.get('nome').value;
    const descricao = this.form.get('descricao').value;
    const preco_compra = Number(this.form.get('preco_compra').value);
    const preco_venda = Number(this.form.get('preco_venda').value);

    const sub = this.produtosService.update(id, { nome, descricao, preco_compra, preco_venda, imagem_principal_id: this.imagem_principal_id })
      .subscribe(data => {
        this.createdProdutoId = data.id;
        this.wasCreated = true;
        this.fechar();
      });

    this.subscriptions.add(sub);
  }

  fechar() {
    this.modal.dismiss(this.wasCreated);
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


  isInputError(inputName: string): boolean {
    const resp =
      !this.form.controls[inputName].untouched &&
      this.form.controls[inputName].errors;

    if (resp) {
      return true;
    }
    return false;
  }

  disableAtualizarBtn(): boolean {
    const situacao = !this.form.valid;

    return situacao;
  }


}
