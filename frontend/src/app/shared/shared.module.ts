import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PaginationComponent } from './pagination/pagination.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [PaginationComponent, SidebarComponent],
  imports: [CommonModule, FormsModule, RouterModule],
  exports: [
    CommonModule,
    FormsModule,
    RouterModule,
    PaginationComponent,
    SidebarComponent,
  ],
})
export class SharedModule {}
