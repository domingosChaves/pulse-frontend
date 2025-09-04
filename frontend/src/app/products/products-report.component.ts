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

  // paginação por grupo
  pageSize = 10;
  private groupPage: Record<string, number> = {};

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

    // resetar páginas se filtro mudou
    this.groupPage = {};
  }

  onFilterChange(): void {
    this.applyFilterAndGroup();
  }

  clearFilter(): void {
    this.selectedManufacturerId = null;
    this.applyFilterAndGroup();
  }

  onPageSizeChange(): void {
    // ao mudar pageSize, voltar cada grupo para página 1
    this.groupPage = {};
  }

  // helpers de fabricante
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

  // paginação por grupo
  private keyFor(id: number | null): string {
    return id === null ? 'null' : String(id);
  }

  pageForGroup(id: number | null): number {
    const k = this.keyFor(id);
    return this.groupPage[k] || 1;
  }

  setPageForGroup(id: number | null, p: number): void {
    const total = this.totalPagesForGroup(id);
    if (p < 1 || p > total) return;
    const k = this.keyFor(id);
    this.groupPage[k] = p;
  }

  totalPagesForGroup(id: number | null): number {
    const g = this.groups.find((x) => x.manufacturerId === id);
    if (!g) return 1;
    return Math.max(1, Math.ceil(g.items.length / this.pageSize));
  }

  pagedItemsForGroup(id: number | null): Product[] {
    const g = this.groups.find((x) => x.manufacturerId === id);
    if (!g) return [];
    const page = this.pageForGroup(id);
    const start = (page - 1) * this.pageSize;
    return g.items.slice(start, start + this.pageSize);
  }

  // exportação CSV (geral)
  exportCsv(): void {
    const rows: Array<Array<string>> = [];
    // cabeçalho
    rows.push(['Fabricante', 'ID', 'Nome', 'Descrição']);
    // dados
    for (const p of this.filtered) {
      const manuf = this.getManufacturerName(p) || '';
      rows.push([
        manuf,
        String(p.id ?? ''),
        p.nome ?? '',
        p.descricao ?? '',
      ]);
    }
    const csv = rows.map((r) => r.map(this.csvEscape).join(',')).join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'relatorio-produtos.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  // exportação CSV por grupo
  exportGroupCsv(id: number | null): void {
    const g = this.groups.find((x) => x.manufacturerId === id);
    if (!g) return;
    const rows: Array<Array<string>> = [];
    rows.push(['Fabricante', 'ID', 'Nome', 'Descrição']);
    for (const p of g.items) {
      const manuf = g.manufacturerName || '';
      rows.push([
        manuf,
        String(p.id ?? ''),
        p.nome ?? '',
        p.descricao ?? '',
      ]);
    }
    const csv = rows.map((r) => r.map(this.csvEscape).join(',')).join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-produtos-${(g.manufacturerName || 'sem-fabricante').replace(/\s+/g, '-').toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  private csvEscape(value: string): string {
    const needsQuote = /[",\n]/.test(value);
    let v = value.replace(/"/g, '""');
    return needsQuote ? `"${v}"` : v;
  }
}
