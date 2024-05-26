import { Component } from '@angular/core';
import { CategoriaService } from '../Servicios/categoria.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})
export class CRUDComponent {
  result: any;
  nombre: string = '';
  precio: number | null = null;
  categoriaSeleccionada: number| null=null;
  categorias: any[] = [];
  cantidad: number | null=null;
  nombre_categoria: string= '';
  productos: any = [];
  consultas: any = [];
  productoSeleccionado: number | null = null;
  productoSeleccionado1: number | null = null;
  constructor(private http: HttpClient, private transactionService: CategoriaService, private router: Router) {}

  ngOnInit(): void {
    this.obtenerProductos();
  
  }
  
  obtenerCategorias() {
    this.http.get<any[]>('http://54.235.56.148:5000/categoria')
      .subscribe(
        (data) => {
          this.categorias = data.map(categoria => ({
            id_categoria: categoria[0],
            nombre_categoria: categoria[1]
          }));
          console.log('Categorías:', this.categorias);
        },
        (error) => {
          console.error('Error al obtener las categorías:', error);
        }
      );
  }
  obtenerProductos(){
    this.http.get<any[]>('http://54.235.56.148:5000/producto')
      .subscribe(
        (data)=>{
          this.productos =data.map(producto => ({
            id_producto:producto[0],
            nombre: producto[1],
            precio: producto[2],
            id_categoria: producto[3]
          }))
          console.log(this.productos);
          this.obtenerCategorias();
        })
  }
  

  crear_categoria() {
    this.http.post(`http://54.235.56.148:5000/crear_cate/${this.nombre_categoria}`, {})
      .subscribe(response => {
        console.log('Categoría creada:', response);
      }, error => {
        console.error('Error al crear la categoría:', error);
      });
  }

  crear_producto(){
    this.http.post(`http://54.235.56.148:5000/crear_prod/${this.nombre}/${this.precio}/${this.categoriaSeleccionada}`, {})
    .subscribe(response=>{
        console.log('producto creado:', response);
    }, error=>{
        console.error('Error al crear el producto', error)
    } )
  }
  showStockForm(id_producto: number) {
    this.productoSeleccionado = id_producto;
  }  
  stock(){
    if (this.productoSeleccionado !== null && this.cantidad !== null) {
      this.http.post(`http://54.235.56.148:5000/crear_stock/${this.cantidad}/${this.productoSeleccionado}`,{})
      .subscribe(response=> {
        console.log('stock asignado:', response);
        
      }, error=> {
        console.error('stock asignado:', error)
      })
      
      
    } else {
      console.error('ID del producto o cantidad no especificada');
    }
  }
  showCantidad(id_producto: number) {
    this.productoSeleccionado1 = id_producto;
    console.log(this.productoSeleccionado1)
  }  
  obtenerConsulta() {
    this.http.get<any[]>(`http://54.235.56.148:5000/stock_Producto/${this.productoSeleccionado1}`)
      .subscribe(
        (data) => {
          this.consultas = data.map(consulta => ({
            id_producto: consulta.id_producto,
            nombre: consulta.nombre,
            precio: consulta.precio,
            nombre_categoria: consulta.nombre_categoria,
            cantidad: consulta.cantidad
          }));
          console.log('Consultas:', this.consultas);
        },
        (error) => {
          console.error('Error al obtener las consultas:', error);
        }
    );
  }
  createTransaction() {
    const data = {
      buy_order: '12345678',
      session_id: 'abcd1234',
      amount: 10000
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
  
}

