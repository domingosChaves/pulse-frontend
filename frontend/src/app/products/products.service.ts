import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/api.service';
import { Product } from './product.model';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private resource = '/products';

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
}

