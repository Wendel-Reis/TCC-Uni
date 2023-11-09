

import { Component, OnInit } from '@angular/core';
import { AppConfig } from './../../app.config';
import { StorageService } from './../../shared/services/auth/storage.service';
import { Role } from './../../shared/constants/role.constants';

@Component({
  selector: 'app-pdv',
  templateUrl: './pdv.page.html',
  styleUrls: ['./pdv.page.scss'],
})
export class PdvPage implements OnInit {

  constructor(
    private readonly storageService: StorageService,
    private readonly appConfig: AppConfig,
  ) { }

  ngOnInit() {
    const userRole = this.storageService.getRole();
    if (userRole == Role.COLABORADOR) {
      this.appConfig.appPages = [];
    }
  }

}
