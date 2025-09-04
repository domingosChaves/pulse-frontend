import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ManufacturersService } from './manufacturers.service';
import { ApiService } from '../core/api.service';
import { Manufacturer } from './manufacturer.model';

class MockApiService {
  get = jasmine.createSpy('get').and.returnValue(of([]));
  post = jasmine.createSpy('post').and.returnValue(of({}));
  put = jasmine.createSpy('put').and.returnValue(of({}));
  delete = jasmine.createSpy('delete').and.returnValue(of(undefined));
}

describe('Serviço de Fabricantes', () => {
  let service: ManufacturersService;
  let api: MockApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ManufacturersService,
        { provide: ApiService, useClass: MockApiService },
      ],
    });
    service = TestBed.inject(ManufacturersService);
    api = TestBed.inject(ApiService) as unknown as MockApiService;
  });

  it('deve listar fabricantes', (done) => {
    const data: Manufacturer[] = [
      { id: 1, nome: 'A' },
      { id: 2, nome: 'B' },
    ];
    api.get.and.returnValue(of(data));

    service.list().subscribe((res) => {
      expect(api.get).toHaveBeenCalledWith('/fabricantes');
      expect(res.length).toBe(2);
      done();
    });
  });

  it('deve obter por id', (done) => {
    const item: Manufacturer = { id: 10, nome: 'Z' };
    api.get.and.returnValue(of(item));

    service.get(10).subscribe((res) => {
      expect(api.get).toHaveBeenCalledWith('/fabricantes/10');
      expect(res.id).toBe(10);
      done();
    });
  });

  it('deve criar', (done) => {
    const payload: Manufacturer = { nome: 'Novo' };
    const created = { id: 3, nome: 'Novo' } as Manufacturer;
    api.post.and.returnValue(of(created));

    service.create(payload).subscribe((res) => {
      expect(api.post).toHaveBeenCalledWith('/fabricantes', payload);
      expect(res.id).toBe(3);
      done();
    });
  });

  it('deve atualizar', (done) => {
    const payload: Manufacturer = { id: 3, nome: 'Editar' };
    api.put.and.returnValue(of(payload));

    service.update(3, payload).subscribe((res) => {
      expect(api.put).toHaveBeenCalledWith('/fabricantes/3', payload);
      expect(res.nome).toBe('Editar');
      done();
    });
  });

  it('deve deletar', (done) => {
    api.delete.and.returnValue(of(undefined));

    service.delete(4).subscribe((res) => {
      expect(api.delete).toHaveBeenCalledWith('/fabricantes/4');
      expect(res).toBeUndefined();
      done();
    });
  });
});
