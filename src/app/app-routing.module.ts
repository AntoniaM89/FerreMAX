import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CRUDComponent } from './crud/crud.component';
import { ReturnComponent } from './transbank/return/return.component';


const routes: Routes = [
  { path: '', component: CRUDComponent},
  { path: 'return', component: ReturnComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
