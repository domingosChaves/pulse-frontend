import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ManufacturersListComponent } from './manufacturers/manufacturers-list.component';
import { ManufacturerFormComponent } from './manufacturers/manufacturer-form.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { ProductsListComponent } from './products/products-list.component';
import { ProductFormComponent } from './products/product-form.component';
import { ProductsReportComponent } from './products/products-report.component';
import { LoginComponent } from './auth/login.component';
import { OAuthCallbackComponent } from './auth/oauth-callback.component';

@NgModule({
  declarations: [
    AppComponent,
    ManufacturersListComponent,
    ManufacturerFormComponent,
    ProductsListComponent,
    ProductFormComponent,
    ProductsReportComponent,
    LoginComponent,
    OAuthCallbackComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
