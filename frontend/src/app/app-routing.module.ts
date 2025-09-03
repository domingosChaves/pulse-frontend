import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManufacturersListComponent } from './manufacturers/manufacturers-list.component';
import { ManufacturerFormComponent } from './manufacturers/manufacturer-form.component';
import { ProductsListComponent } from './products/products-list.component';
import { ProductFormComponent } from './products/product-form.component';

const routes: Routes = [
  { path: '', redirectTo: 'manufacturers', pathMatch: 'full' },
  { path: 'manufacturers', component: ManufacturersListComponent },
  { path: 'manufacturers/new', component: ManufacturerFormComponent },
  { path: 'manufacturers/edit/:id', component: ManufacturerFormComponent },
  { path: 'products', component: ProductsListComponent },
  { path: 'products/new', component: ProductFormComponent },
  { path: 'products/edit/:id', component: ProductFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
