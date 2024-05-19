import { Component } from '@angular/core';
import { CategoriaService } from '../Servicios/categoria.service';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})
export class CRUDComponent {
  nombre: string = '';
  precio: number | null = null;
  categoriaSeleccionada: string = '';
  categorias: any[] = [];

  constructor(private categoryService: CategoriaService) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(data => {
      console.log('Categorías obtenidas:', data); 
      this.categorias = data;
    }, error => {
      console.error('Error al obtener categorías:', error); 
    });
  }

}
