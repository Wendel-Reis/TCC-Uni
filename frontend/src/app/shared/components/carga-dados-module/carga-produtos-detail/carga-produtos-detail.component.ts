import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CargaDadosDto } from 'src/app/shared/interfaces/carga-dados/carga-dados.dto';
import { CargaProdutosDto } from 'src/app/shared/interfaces/carga-dados/carga-produtos.dto';
import { ProdutosHistoricoService } from 'src/app/shared/services/historico/produtos-historico/produtos-historico.service';

@Component({
  selector: 'app-carga-produtos-detail',
  templateUrl: './carga-produtos-detail.component.html',
  styleUrls: ['./carga-produtos-detail.component.scss'],
})
export class CargaProdutosDetailComponent implements OnInit {
  @Input('carga')
  carga: CargaDadosDto;
  produtosCarregado: CargaProdutosDto[] = [];

  tabelasAfetadas: string[] = [];

  constructor(
    private readonly modal: ModalController,
    private readonly produtosHistoricoService: ProdutosHistoricoService,
  ) { }

  ngOnInit() {
    this.tabelasAfetadas = this.carga.tabelas_afetadas.split("; ").filter(t => t.trim() != '');
    this.produtosHistoricoService.findByCargaId(this.carga.id)
      .subscribe(data => {
        this.produtosCarregado = data;
        console.log(this.produtosCarregado);
      });
  }

  fechar(wasCreated = false, data?: any) {
    this.modal.dismiss(wasCreated, data);
  }

}
