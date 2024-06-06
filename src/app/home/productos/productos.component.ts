import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Producto {
  id_producto: number;
  nombre: string;
  precio: number;
  nombre_categoria: string;
  cantidad: number;
}

interface CarritoItem {
  name: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent {
  productos: Producto[] = [];
  carritoItems: CarritoItem[] = [];
  totalPrice: number = 0;
  private apiUrl = 'http://18.207.92.146:5000';
  constructor(private http: HttpClient) {}
  ngOnInit(): void{
    this.obtenerProductos()
  }
  obtenerProductos(){
    this.http.get<any[]>(`${this.apiUrl}/stock_Producto`)
      .subscribe(
        (data)=>{
          this.productos =data.map(producto => ({
            id_producto:producto[0],
            nombre: producto[1],
            precio: producto[2],
            nombre_categoria: producto[3],
            cantidad: producto[4]
          }))
          
          console.log(this.productos);
        }
      );
    }
  agregarCarrito(producto:Producto, cantidad: number): void {
    const item: CarritoItem = {
      name: producto.nombre,
      price: producto.precio,
      quantity: cantidad
    }
    this.carritoItems.push(item);
      this.actualizarPrecio();
  }
  actualizarPrecio(): void{
    this.totalPrice = this.carritoItems.reduce((total, item)=> total + (item.price * item.quantity), 0);
  }
}
