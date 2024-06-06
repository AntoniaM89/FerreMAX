import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

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
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  carritoItems: CarritoItem[] = [];
  totalPrice: number = 0;
  monedaSeleccionada: string = 'CLP';
  tipoCambio: number = 1; // Inicializa el tipo de cambio con un valor predeterminado
  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerProductos();
  }

  obtenerProductos(): void {
    this.http.get<Producto[]>(`${this.apiUrl}/stock_Producto`)
      .subscribe((data) => {
        this.productos = data.map((producto: any) => ({
          id_producto: producto[0],
          nombre: producto[1],
          precio: producto[2],
          nombre_categoria: producto[3],
          cantidad: producto[4],
          cantidadSeleccionada: 1
        }));
      });
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
      const item: CarritoItem = {
        name: producto.nombre,
        price: producto.precio,
        quantity: producto.cantidadSeleccionada,
        maxQuantity: producto.cantidad
      };
      this.carritoItems.push(item);
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

  createTransaction(totalPrice: number): void {
    const data = {
      buy_order: '12345678',
      session_id: 'abcd1234',
      amount: totalPrice
    };
    this.http.post<{ url: string; token: string }>(`${this.apiUrl}/transaction`, data)
      .subscribe(response => {
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
        this.tipoCambio = tipoCambio;
        console.log(this.tipoCambio)
      }, error => {
        console.error('Error obteniendo el tipo de cambio', error);
      });

  }
}
