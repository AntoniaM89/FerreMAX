import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CategoriaService } from 'src/app/Servicios/categoria.service';

interface Producto {
  id_producto: number;
  nombre: string;
  precio: number;
  nombre_categoria: string;
  cantidad: number;
  cantidadSeleccionada: number; 
}

interface CarritoItem {
  name: string;
  price: number;
  quantity: number;
  maxQuantity: number; 
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
  monedaSeleccionada: string = 'CLP';
  private apiUrl = 'http://34.202.160.94:5000';
  tipoCambio: number = 2;

  constructor(private http: HttpClient, private transactionService: CategoriaService) {}

  ngOnInit(): void {
    this.obtenerProductos();
  }

  obtenerProductos(): void {
    this.http.get<Producto[]>(`${this.apiUrl}/stock_Producto`)
      .subscribe((data) => {
        this.productos = data.map((producto:any) => ({
          id_producto: producto[0],
          nombre: producto[1],
          precio: producto[2],
          nombre_categoria: producto[3],
          cantidad: producto[4],
          cantidadSeleccionada: 1 
        }));
        
      });
      this.getCambio();
  }

  agregarAlCarrito(producto: Producto): void {
     
    const itemIndex = this.carritoItems.findIndex(item => item.name === producto.nombre);

    if (itemIndex !== -1) {
     
      const cantidadTotal = this.carritoItems[itemIndex].quantity + producto.cantidadSeleccionada;
      if (cantidadTotal > producto.cantidad) {
       
        this.carritoItems[itemIndex].quantity = producto.cantidad;
      } else {
        
        this.carritoItems[itemIndex].quantity += producto.cantidadSeleccionada;
      }
    } else {

      if (producto.cantidadSeleccionada > producto.cantidad) {

        const item: CarritoItem = {
          name: producto.nombre,
          price: producto.precio,
          quantity: producto.cantidad,
          maxQuantity: producto.cantidad
        };
        this.carritoItems.push(item);
      } else {
        const item: CarritoItem = {
          name: producto.nombre,
          price: producto.precio,
          quantity: producto.cantidadSeleccionada,
          maxQuantity: producto.cantidad
        };
        this.carritoItems.push(item);
      }
    }

    this.actualizarPrecioTotal();
  }
  
  actualizarPrecioTotal(): void {
    this.totalPrice = this.carritoItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  eliminarDelCarrito(index: number): void {
    this.carritoItems.splice(index, 1);
    this.actualizarPrecioTotal();
  }
  createTransaction(totalPrice:number) {
    const data = {
      buy_order: '12345678',
      session_id: 'abcd1234',
      amount: totalPrice
    };
    this.transactionService.createTransaction(data).subscribe(response => {
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = response.url;
      const tokenField = document.createElement('input');
      tokenField.type = 'hidden';
      tokenField.name = 'token_ws';
      tokenField.value = response.token;
      form.appendChild(tokenField);
      document.body.appendChild(form);
      form.submit();
  }, error => {
      console.error('Error creando la transacción', error);
  });
  }

  getCambio(): void {
    this.http.get<number>(`${this.apiUrl}/conversion`)
      .subscribe((tipoCambio: number) => {
        this.tipoCambio = tipoCambio; // Aquí deberías asignar el valor a la variable correcta
      }, error => {
        console.error('Error obteniendo el tipo de cambio', error);
      });
  }
}
