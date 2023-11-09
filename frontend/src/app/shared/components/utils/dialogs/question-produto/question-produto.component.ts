import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';

import { ProdutoService } from './../../../../services/produto/produto.service';
import { ProdutoDto } from './../../../../interfaces/produtos/produto.dto';

@Component({
  selector: 'app-question-produto',
  templateUrl: './question-produto.component.html',
  styleUrls: ['./question-produto.component.scss'],
})
export class QuestionProdutoComponent implements OnInit, OnDestroy {

  @Input()
  showDialog = false;

  @Input()
  selectedProduto: ProdutoDto;

  @Input()
  produto_id: string;

  @Output()
  closeEvent: EventEmitter<boolean> = new EventEmitter();

  private subscriptions = new Subscription();

  constructor(
    private readonly produtoService: ProdutoService,
  ) { }

  ngOnInit() {
    if (this.selectedProduto) {
      this.showDialog = true;
    } else {
      this.loadProduto();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }


  loadProduto() {
    if (!this.selectedProduto && !this.produto_id) {
      this.close();
      return;
    }

    const sub = this.produtoService.findById(this.produto_id)
      .subscribe(data => {
        this.selectedProduto = data;
        this.showDialog = true;
      });
      this.subscriptions.add(sub);
  }

  close() {
    this.showDialog = false;
    this.closeEvent.emit(this.showDialog);
  }
}
