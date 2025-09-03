import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManufacturersListComponent } from './manufacturers/manufacturers-list.component';
import { ManufacturerFormComponent } from './manufacturers/manufacturer-form.component';

const routes: Routes = [
  { path: '', redirectTo: 'manufacturers', pathMatch: 'full' },
  { path: 'manufacturers', component: ManufacturersListComponent },
  { path: 'manufacturers/new', component: ManufacturerFormComponent },
  { path: 'manufacturers/edit/:id', component: ManufacturerFormComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
