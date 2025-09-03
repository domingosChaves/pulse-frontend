import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ManufacturersService } from './manufacturers.service';
import { Manufacturer } from './manufacturer.model';

@Component({
  selector: 'app-manufacturers-list',
  templateUrl: './manufacturers-list.component.html',
  styleUrls: ['./manufacturers-list.component.scss']
})
export class ManufacturersListComponent implements OnInit {
  manufacturers: Manufacturer[] = [];
  loading = false;
  error = '';

  constructor(private service: ManufacturersService, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  newManufacturer(): void {
    this.router.navigate(['/manufacturers/new']);
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.service.list().subscribe({
      next: data => {
        this.manufacturers = data;
        this.loading = false;
      },
      error: err => {
        this.error = 'Falha ao carregar fabricantes.';
        this.loading = false;
      }
    });
  }

  edit(id?: number): void {
    if (id != null) this.router.navigate(['/manufacturers/edit', id]);
  }

  confirmDelete(id?: number): void {
    if (!id) return;
    if (!confirm('Confirma exclusão deste fabricante?')) return;
    this.service.delete(id).subscribe({
      next: () => this.load(),
      error: () => alert('Falha ao excluir fabricante.')
    });
  }
}
