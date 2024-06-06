import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CRUDComponent } from './crud/crud.component';
import { ReturnComponent } from './transbank/return/return.component';
import { ProductosComponent } from './home/productos/productos.component';


const routes: Routes = [
  { path: '', component: ProductosComponent},
  { path: 'return', component: ReturnComponent},
  { path: 'crud', component:CRUDComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
