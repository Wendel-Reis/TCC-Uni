import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-carga-dados',
  templateUrl: './carga-dados.page.html',
  styleUrls: ['./carga-dados.page.scss'],
})
export class CargaDadosPage implements OnInit {

  currentTab = 'historico';
  selectedOption: string = undefined;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
  ) {
    this.currentTab =
      this.activatedRoute.snapshot.queryParamMap.get('tab') ||
      'historico';

      this.selectedOption =
      this.activatedRoute.snapshot.queryParamMap.get('option') ||
      undefined;

  }

  ngOnInit() {
    //this.currentTab = 'carregar';
  }

  changeTab(event) {
    this.currentTab = event.detail.value;
  }

}
