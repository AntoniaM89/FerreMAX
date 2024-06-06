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

  isAuthorized: boolean | null = null;
  constructor(private route: ActivatedRoute, private transactionService: CategoriaService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token_ws = params['token_ws'];
      if (token_ws) {
        this.transactionService.getTransaccionResultado(token_ws).subscribe(result => {
          this.result = result;
          this.isAuthorized = result.status === 'AUTHORIZED';
        }, error => {
          console.error('Error obteniendo el resultado de la transaccion', error);
          this.isAuthorized = false;
        });
      }
    });
  }
}
