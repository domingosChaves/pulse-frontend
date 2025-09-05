import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/api.service';
import { Product } from './product.model';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private resource = '/produtos';

  constructor(private api: ApiService) {}

  list(): Observable<Product[]> {
    return this.api.get<Product[]>(this.resource);
  }

  get(id: number): Observable<Product> {
    return this.api.get<Product>(`${this.resource}/${id}`);
  }

  create(product: Product): Observable<Product> {
    return this.api.post<Product>(this.resource, product);
  }

  update(id: number, product: Product): Observable<Product> {
    return this.api.put<Product>(`${this.resource}/${id}`, product);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.resource}/${id}`);
  }

  // Paginação: /produtos/paged?nome=&fabricanteId=&page=&size=&sort=
  paged(params: {
    nome?: string;
    fabricanteId?: number;
    page?: number;
    size?: number;
    sort?: string;
  }): Observable<any> {
    return this.api.get<any>(`${this.resource}/paged`, params as any);
  }

  // Relatório agrupado por nome do fabricante
  report(): Observable<Record<string, Product[]>> {
    return this.api.get<Record<string, Product[]>>(
      `${this.resource}/relatorio`
    );
  }
}
