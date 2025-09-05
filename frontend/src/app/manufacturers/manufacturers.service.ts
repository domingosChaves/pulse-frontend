import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Manufacturer } from './manufacturer.model';
import { ApiService } from '../core/api.service';

@Injectable({ providedIn: 'root' })
export class ManufacturersService {
  private resource = '/fabricantes';

  constructor(private api: ApiService) {}

  list(): Observable<Manufacturer[]> {
    return this.api.get<Manufacturer[]>(this.resource);
  }

  get(id: number): Observable<Manufacturer> {
    return this.api.get<Manufacturer>(`${this.resource}/${id}`);
  }

  create(manufacturer: Manufacturer): Observable<Manufacturer> {
    return this.api.post<Manufacturer>(this.resource, manufacturer);
  }

  update(id: number, manufacturer: Manufacturer): Observable<Manufacturer> {
    return this.api.put<Manufacturer>(`${this.resource}/${id}`, manufacturer);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.resource}/${id}`);
  }
}
