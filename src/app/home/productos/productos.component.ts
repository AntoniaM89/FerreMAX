import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent {
  productos: any = [];
  private apiUrl = 'http://18.207.92.146:5000';
  constructor(private http: HttpClient) {}
  ngOnInit(): void{
    this.obtenerProductos()
  }

  obtenerProductos(){
    this.http.get<any[]>(`${this.apiUrl}/producto`)
      .subscribe(
        (data)=>{
          this.productos =data.map(producto => ({
            id_producto:producto[0],
            nombre: producto[1],
            precio: producto[2],
          }))
          console.log(this.productos);

        })
  }
  
}
