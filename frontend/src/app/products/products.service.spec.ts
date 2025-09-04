import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ProductsService } from './products.service';
import { ApiService } from '../core/api.service';
import { Product } from './product.model';

class MockApiService {
  get = jasmine.createSpy('get').and.returnValue(of([]));
  post = jasmine.createSpy('post').and.returnValue(of({}));
  put = jasmine.createSpy('put').and.returnValue(of({}));
  delete = jasmine.createSpy('delete').and.returnValue(of(undefined));
}

describe('Serviço de Produtos', () => {
  let service: ProductsService;
  let api: MockApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductsService,
        { provide: ApiService, useClass: MockApiService },
      ],
    });
    service = TestBed.inject(ProductsService);
    api = TestBed.inject(ApiService) as unknown as MockApiService;
  });

  it('deve listar produtos', (done) => {
    const data: Product[] = [
      { id: 1, nome: 'P1', fabricanteId: 1 },
      { id: 2, nome: 'P2', fabricanteId: 2 },
    ];
    api.get.and.returnValue(of(data));

    service.list().subscribe((res) => {
      expect(api.get).toHaveBeenCalledWith('/produtos');
      expect(res.length).toBe(2);
      done();
    });
  });

  it('deve obter por id', (done) => {
    const item: Product = { id: 10, nome: 'XPTO', fabricanteId: 99 };
    api.get.and.returnValue(of(item));

    service.get(10).subscribe((res) => {
      expect(api.get).toHaveBeenCalledWith('/produtos/10');
      expect(res.id).toBe(10);
      done();
    });
  });

  it('deve criar', (done) => {
    const payload: Product = { nome: 'Novo', fabricanteId: 1 };
    const created = { id: 3, ...payload } as Product;
    api.post.and.returnValue(of(created));

    service.create(payload).subscribe((res) => {
      expect(api.post).toHaveBeenCalledWith('/produtos', payload);
      expect(res.id).toBe(3);
      done();
    });
  });

  it('deve atualizar', (done) => {
    const payload: Product = {
      id: 3,
      nome: 'Editar',
      fabricanteId: 1,
    } as Product;
    api.put.and.returnValue(of(payload));

    service.update(3, payload).subscribe((res) => {
      expect(api.put).toHaveBeenCalledWith('/produtos/3', payload);
      expect(res.nome).toBe('Editar');
      done();
    });
  });

  it('deve deletar', (done) => {
    api.delete.and.returnValue(of(undefined));

    service.delete(4).subscribe((res) => {
      expect(api.delete).toHaveBeenCalledWith('/produtos/4');
      expect(res).toBeUndefined();
      done();
    });
  });

  it('deve paginar produtos (paged)', (done) => {
    const resp = { content: [], totalElements: 0 };
    api.get.and.returnValue(of(resp));

    service.paged({ nome: 'Prod', page: 0, size: 10 }).subscribe((res) => {
      expect(api.get).toHaveBeenCalledWith('/produtos/paged', {
        nome: 'Prod',
        page: 0,
        size: 10,
      } as any);
      expect(res).toEqual(resp);
      done();
    });
  });

  it('deve obter relatório de produtos (report)', (done) => {
    const rel: Record<string, Product[]> = { 'Fab X': [] };
    api.get.and.returnValue(of(rel));

    service.report().subscribe((res) => {
      expect(api.get).toHaveBeenCalledWith('/produtos/relatorio');
      expect(res).toEqual(rel);
      done();
    });
  });
});
