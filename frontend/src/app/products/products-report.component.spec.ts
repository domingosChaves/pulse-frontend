import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { ProductsReportComponent } from './products-report.component';
import { ProductsService } from './products.service';
import { ManufacturersService } from '../manufacturers/manufacturers.service';
import { Product } from './product.model';
import { Manufacturer } from '../manufacturers/manufacturer.model';

class MockProductsService {
  constructor(private data: Product[] = []) {}
  list() {
    return of(this.data);
  }
}
class MockManufacturersService {
  constructor(private data: Manufacturer[] = []) {}
  list() {
    return of(this.data);
  }
}

describe('Componente de Relatório de Produtos', () => {
  let component: ProductsReportComponent;
  let fixture: ComponentFixture<ProductsReportComponent>;

  const prods: Product[] = [
    { id: 1, nome: 'P1', fabricanteId: 1 },
    { id: 2, nome: 'P2', fabricanteId: 1 },
    { id: 3, nome: 'P3', fabricanteId: 2 },
  ];
  const mans: Manufacturer[] = [
    { id: 1, nome: 'Fab A' },
    { id: 2, nome: 'Fab B' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductsReportComponent],
      imports: [FormsModule],
      providers: [
        { provide: ProductsService, useValue: new MockProductsService(prods) },
        {
          provide: ManufacturersService,
          useValue: new MockManufacturersService(mans),
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // ngOnInit
  });

  it('deve agrupar produtos por fabricante', () => {
    expect(component.groups.length).toBe(2);
    const names = component.groups.map((g) => g.manufacturerName);
    expect(names).toContain('Fab A');
    expect(names).toContain('Fab B');
  });

  it('deve filtrar por fabricante', () => {
    component.selectedManufacturerId = 1;
    component.onFilterChange();
    expect(component.groups.length).toBe(1);
    expect(component.groups[0].items.length).toBe(2);
  });

  it('deve paginar por grupo', () => {
    component.pageSize = 1;
    component.onPageSizeChange();
    // grupo do fabricante 1 tem 2 itens
    const id = 1;
    expect(component.totalPagesForGroup(id)).toBe(2);
    let page1 = component.pagedItemsForGroup(id);
    expect(page1.length).toBe(1);
    component.setPageForGroup(id, 2);
    let page2 = component.pagedItemsForGroup(id);
    expect(page2.length).toBe(1);
    expect(page1[0].id).not.toBe(page2[0].id);
  });

  it('deve exportar CSV geral', () => {
    const aSpy = jasmine.createSpyObj('a', ['click']);
    spyOn(document, 'createElement').and.returnValue(aSpy as any);
    const urlSpy = spyOn(URL, 'createObjectURL').and.returnValue('blob://file');
    const revokeSpy = spyOn(URL, 'revokeObjectURL');

    component.exportCsv();

    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(urlSpy).toHaveBeenCalled();
    expect(aSpy.click).toHaveBeenCalled();
    expect(revokeSpy).toHaveBeenCalled();
  });

  it('deve exportar CSV por grupo', () => {
    const aSpy = jasmine.createSpyObj('a', ['click']);
    spyOn(document, 'createElement').and.returnValue(aSpy as any);
    spyOn(URL, 'createObjectURL').and.returnValue('blob://file');
    spyOn(URL, 'revokeObjectURL');

    component.exportGroupCsv(1);

    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(aSpy.click).toHaveBeenCalled();
  });
});
