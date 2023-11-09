import { ComponentRef, ComponentProps } from '@ionic/core';


import { Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Dropdown } from 'primeng/dropdown';
import { FileUpload } from 'primeng/fileupload';

import { LojaDto } from '../../../../../shared/interfaces/lojas/loja.dto';
import { PerfilDto } from '../../../../../shared/interfaces/perfis/perfil.dto';
import { LojaService } from '../../../../../shared/services/loja/loja.service';
import { PerfilService } from '../../../../../shared/services/perfil/perfil.service';
import { UserService } from '../../../../../shared/services/user/user.service';
import { PageOrder } from './../../../../constants/page.constant';
import { PageableDto } from './../../../../interfaces/others/pageable.dto';
import { UserDto } from './../../../../interfaces/users/user.dto';
import { StatusUser } from './../../../../constants/status.constant';
import { ToastMessageService } from './../../../../services/toast/toast-message.service';
import { ToastEnum, ToastPrimeSeverityEnum } from '../../../../../shared/constants/toast.constant';
import { StorageService } from './../../../../services/auth/storage.service';
import { Role } from './../../../../constants/role.constants';
import { ColaboradorBriefComponent } from '../../../utils/briefs/colaborador-brief/colaborador-brief.component';

@Component({
  selector: 'app-funcionario-detail',
  templateUrl: './funcionario-detail.component.html',
  styleUrls: ['./funcionario-detail.component.scss'],
})
export class FuncionarioDetailComponent implements OnInit, OnDestroy {

  @Input()
  user: UserDto;

  @Input()
  isModal = true;

  @Output()
  updatedEvent: EventEmitter<any> = new EventEmitter();

  form: UntypedFormGroup;
  perfis: PageableDto<PerfilDto>;
  currentPerfilTake = 15;

  lojas: PageableDto<LojaDto>;
  selectedLoja: string;
  currentLojasPage = 1;
  searchedLoja = '';
  isLoaded = false;


  superiores: PageableDto<UserDto>;
  searchedSuperior = '';
  selectedSuperior: UserDto;
  showSuperiorDialog = false;

  steps: MenuItem[];
  stepIndex = 0;

  createdUserId = '';
  userWasCreated = false;
  sortStatus = StatusUser;

  private subscriptions = new Subscription();

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly userService: UserService,
    private readonly lojaService: LojaService,
    private readonly perfilService: PerfilService,
    private readonly modal: ModalController,
    private readonly toastService: ToastMessageService,
    private readonly toastMessageService: ToastMessageService,
    private readonly storage: StorageService,
    private readonly modalDetail: ModalController,
  ) { }

  ngOnInit() {

    this.loadLojas();
    this.loadPerfis();
    this.loadSuperiores();

    const { nome, status, loja, perfil,  nivel_superior } = this.user;
    const loja_id = loja?.id || undefined;

    this.form = this.formBuilder.group({
      nome: [nome, [Validators.required]],
      status: [status, [Validators.required,]],
      perfil_id: [perfil, [Validators.required,]],
      loja_id: [loja_id, [Validators.required,]],
      superior: [nivel_superior?.id, []],
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadPerfis(page = 1) {
    const sub = this.perfilService.list({ order: PageOrder.ASC, page, take: 5 }, { with_cliente: false })
      .subscribe(data => {
        this.perfis = data;
      });
    this.subscriptions.add(sub);
  }

  lazyLoadPerfis(dropdown: Dropdown) {
    this.currentPerfilTake += 5;
    const sub = this.perfilService.list({ order: PageOrder.ASC, page: 1, take: this.currentPerfilTake }, { with_cliente: false })
      .subscribe(data => {
        this.perfis = data;
        dropdown.show();
      });
    this.subscriptions.add(sub);
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
  searchLoja(dropdown?: Dropdown) {
    this.loadLojas(1, dropdown);
  }
  paginarLojas(event, dropdown?: Dropdown) {
    const { first, rows } = event;
    const page = Number((Number(first) / Number(rows)) + 1);
    if (page != this.currentLojasPage) {
      this.currentLojasPage = page;
      this.loadLojas(page, dropdown);
    }
  }


  //#region SUPERIORES
  loadSuperiores(page = 1, dropdown?: Dropdown) {
    const sub = this.userService.listUsers(
      { searchedUser: this.searchedSuperior },
      { order: PageOrder.ASC, page, take: 10 })
      .subscribe(data => {
        this.superiores = data;
        if (dropdown) {
          dropdown.show();
        }
      });

    this.subscriptions.add(sub);
  }
  paginarSuperior(event) {
    this.loadSuperiores();
  }
  onSuperiorFilter(event) {
    const filter = event.filter as string;
    this.searchedSuperior = filter;
  }
  blurSuperior(event, dropdown: Dropdown) {
    this.searchedSuperior = undefined;
    dropdown.filterValue = undefined;
  }
  detailSuperior() {
    const id = this.form.get('superior').value;
    this.selectedSuperior = this.superiores.data.find(s => s.id == id);

    if (!this.selectedSuperior) {
      this.toastService.presentToast({
        detalhe: `Selecione uma opção primeiro`,
        titulo: `Seleção necessária`,
        duracao: ToastEnum.shortDuration,
        gravidade: ToastPrimeSeverityEnum.INFORMACAO,
      });
      return;
    }

    this.showModal(ColaboradorBriefComponent, { user: this.selectedSuperior });

  }
  //#endregion


  update() {

    /*
    if (!this.checkUpdatePermission()) {
      this.toastService.presentToast({
        titulo: 'Não autorizado',
        detalhe: `Apenas ${Role.ADMIN} e ${Role.GERENTE} podem atualizar essas informações`,
        duracao: ToastEnum.mediumDuration,
        gravidade: ToastPrimeSeverityEnum.ATENCAO
      });
      return;
    }
    */

    const { id } = this.user;
    const nome = this.form.get('nome').value;
    const status = this.form.get('status').value;
    const { id: perfil_id } = this.form.get('perfil_id').value;
    const loja_id = this.form.get('loja_id').value;
    const cargo_id = this.form.get('cargo_id').value;
    const nivel_superior_id = this.form.get('superior').value ? this.form.get('superior').value : undefined;

    const sub = this.userService.updateUser({ nome, perfil_id, loja_id, cargo_id, status, nivel_superior_id }, id)
      .subscribe(response => {
        this.user = response;
        this.createdUserId = response.id;
        this.userWasCreated = true;
        if (this.isModal) {
          this.fechar(true);
        } else {
          this.toastService.presentToast({
            titulo: 'Sucesso',
            detalhe: 'Operação bem sucedida!',
            duracao: ToastEnum.mediumDuration,
            gravidade: ToastPrimeSeverityEnum.SUCESSO
          });
          this.updatedEvent.emit(this.user);
        }
      });
    this.subscriptions.add(sub);
  }

  uploadFile(event, fileUpload: FileUpload) {
    const { id: updated_user_id } = this.user;
    const { id: local_user_id } = this.storage.getLocalUser();

    const file = event.files[0];
    const sub = this.userService.uploadAvatar(file, updated_user_id)
      .subscribe(response => {
        this.user = response;
        this.createdUserId = response.id;
        this.userWasCreated = true;
        this.toastMessageService.presentToast({
          detalhe: 'Foto alterada',
          duracao: ToastEnum.shortDuration,
          gravidade: ToastPrimeSeverityEnum.SUCESSO,
          titulo: 'Sucesso!'
        });
        this.updatedEvent.emit(this.user);
        fileUpload.clear();
      });
    this.subscriptions.add(sub);
  }

  fechar(userWasCreated = false) {
    this.modal.dismiss(this.userWasCreated);
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

  disableUpdateBtn(): boolean {
    const situacao = !this.form.valid;

    return situacao;
  }

  checkUpdatePermission(): boolean {
    return true;
  }


  private async showModal(
    component: ComponentRef,
    componentProps?: ComponentProps
  ) {
    const modal = await this.modalDetail.create({
      component,
      backdropDismiss: false,
      cssClass: 'modal-size-100',
      componentProps,
    });

    modal.onDidDismiss().then((data) => {
    });

    return await modal.present();
  }

}