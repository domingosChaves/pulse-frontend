import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManufacturersListComponent } from './manufacturers/manufacturers-list.component';
import { ManufacturerFormComponent } from './manufacturers/manufacturer-form.component';
import { ProductsListComponent } from './products/products-list.component';
import { ProductFormComponent } from './products/product-form.component';
import { ProductsReportComponent } from './products/products-report.component';
import { LoginComponent } from './auth/login.component';
import { OAuthCallbackComponent } from './auth/oauth-callback.component';
import { AuthGuard } from './core/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'manufacturers', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'auth/callback', component: OAuthCallbackComponent },
  {
    path: 'manufacturers',
    component: ManufacturersListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'manufacturers/new',
    component: ManufacturerFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'manufacturers/edit/:id',
    component: ManufacturerFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'products',
    component: ProductsListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'products/new',
    component: ProductFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'products/edit/:id',
    component: ProductFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'products/report',
    component: ProductsReportComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: 'manufacturers' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
