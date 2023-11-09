import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CargaDadosDto } from 'src/app/shared/interfaces/carga-dados/carga-dados.dto';
import { CargaEstoquesDto } from 'src/app/shared/interfaces/carga-dados/carga-estoques.dto';
import { EstoquesHistoricoService } from 'src/app/shared/services/historico/estoques-historico/estoques-historico.service';

@Component({
  selector: 'app-carga-estoques-detail',
  templateUrl: './carga-estoques-detail.component.html',
  styleUrls: ['./carga-estoques-detail.component.scss'],
})
export class CargaEstoquesDetailComponent implements OnInit {

  @Input('carga')
  carga: CargaDadosDto;
  estoquesCarregado: CargaEstoquesDto[] = [];

  tabelasAfetadas: string[] = [];

  constructor(
    private readonly modal: ModalController,
    private readonly estoquesHistoricoService: EstoquesHistoricoService,
  ) { }

  ngOnInit() {
    this.tabelasAfetadas = this.carga.tabelas_afetadas.split("; ").filter(t => t.trim() != '');
    this.estoquesHistoricoService.findByCargaId(this.carga.id)
      .subscribe(data => {
        this.estoquesCarregado = data;
        console.log(this.estoquesCarregado);
      });
  }

  fechar(wasCreated = false, data?: any) {
    this.modal.dismiss(wasCreated, data);
  }

}
