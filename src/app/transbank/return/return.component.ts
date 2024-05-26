import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoriaService } from 'src/app/Servicios/categoria.service';

@Component({
  selector: 'app-return',
  templateUrl: './return.component.html',
  styleUrls: ['./return.component.css']
})
export class ReturnComponent {
  result: any;

  constructor(private route: ActivatedRoute, private transactionService: CategoriaService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token_ws = params['token_ws'];
      if (token_ws) {
        this.transactionService.getTransactionResult(token_ws).subscribe(result => {
          this.result = result;
        }, error => {
          console.error('Error getting transaction result', error);
        });
      }
    });
  }
}
