import { Component, OnInit } from '@angular/core';
import { ProductsService } from './products.service';
import { Product } from './product.model';
import { ManufacturersService } from '../manufacturers/manufacturers.service';
import { Manufacturer } from '../manufacturers/manufacturer.model';

interface ProductGroup {
  manufacturerId: number | null;
  manufacturerName: string;
  items: Product[];
}

@Component({
  selector: 'app-products-report',
  templateUrl: './products-report.component.html',
  styleUrls: ['./products-report.component.scss'],
})
export class ProductsReportComponent implements OnInit {
  products: Product[] = [];
  filtered: Product[] = [];
  groups: ProductGroup[] = [];
  manufacturers: Manufacturer[] = [];
  selectedManufacturerId: number | null = null;
  loading = false;
  error = '';

  constructor(
    private productsService: ProductsService,
    private manufacturersService: ManufacturersService
  ) {}

  ngOnInit(): void {
    this.loadManufacturers();
    this.loadProducts();
  }

  loadManufacturers(): void {
    this.manufacturersService.list().subscribe({
      next: (m) => (this.manufacturers = m || []),
      error: () => (this.error = 'Falha ao carregar fabricantes.'),
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.error = '';
    this.productsService.list().subscribe({
      next: (data) => {
        this.products = data || [];
        this.applyFilterAndGroup();
        this.loading = false;
      },
      error: () => {
        this.error = 'Falha ao carregar produtos.';
        this.loading = false;
      },
    });
  }

  applyFilterAndGroup(): void {
    const manufId = this.selectedManufacturerId;
    this.filtered = manufId
      ? this.products.filter((p) => this.getManufacturerId(p) === manufId)
      : [...this.products];

    const map = new Map<number | null, ProductGroup>();
    for (const p of this.filtered) {
      const id = this.getManufacturerId(p);
      const name = this.getManufacturerName(p) || 'Sem fabricante';
      if (!map.has(id)) {
        map.set(id, { manufacturerId: id, manufacturerName: name, items: [] });
      }
      map.get(id)!.items.push(p);
    }

    // ordenar grupos por nome
    this.groups = Array.from(map.values()).sort((a, b) =>
      a.manufacturerName.localeCompare(b.manufacturerName)
    );
    // ordenar itens por nome
    for (const g of this.groups) {
      g.items.sort((x, y) => (x.nome || '').localeCompare(y.nome || ''));
    }
  }

  onFilterChange(): void {
    this.applyFilterAndGroup();
  }

  clearFilter(): void {
    this.selectedManufacturerId = null;
    this.applyFilterAndGroup();
  }

  getManufacturerId(p: Product): number | null {
    return (
      p.fabricanteId ||
      (p.fabricante && p.fabricante.id) ||
      (p.manufacturer && p.manufacturer.id) ||
      null
    );
  }

  getManufacturerName(p: Product): string {
    return (
      p.fabricanteNome ||
      (p.fabricante && p.fabricante.nome) ||
      (p.manufacturer && p.manufacturer.nome) ||
      ''
    );
  }
}

