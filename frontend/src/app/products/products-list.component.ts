import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from './products.service';
import { Product } from './product.model';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
})
export class ProductsListComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  error = '';
  searchTerm = '';
  page = 1;
  pageSize = 10;

  constructor(private service: ProductsService, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  newProduct(): void {
    this.router.navigate(['/products/new']);
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.service.list().subscribe({
      next: (data) => {
        this.products = data || [];
        this.loading = false;
      },
      error: () => {
        this.error = 'Falha ao carregar produtos.';
        this.loading = false;
      },
    });
  }

  get filtered(): Product[] {
    const term = this.searchTerm.trim().toLowerCase();
    const filtered = term
      ? this.products.filter((p) => (p.nome || '').toLowerCase().includes(term))
      : this.products;
    return filtered;
  }

  get paged(): Product[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filtered.length / this.pageSize));
  }

  changePage(p: number): void {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
  }

  edit(id?: number): void {
    if (id != null) this.router.navigate(['/products/edit', id]);
  }

  confirmDelete(id?: number): void {
    if (!id) return;
    if (!confirm('Confirma exclusão deste produto?')) return;
    this.service.delete(id).subscribe({
      next: () => this.load(),
      error: () => alert('Falha ao excluir produto.'),
    });
  }

  manufacturerName(p: Product): string {
    return (
      p.fabricanteNome ||
      (p.fabricante && p.fabricante.nome) ||
      (p.manufacturer && p.manufacturer.nome) ||
      ''
    );
  }
}
