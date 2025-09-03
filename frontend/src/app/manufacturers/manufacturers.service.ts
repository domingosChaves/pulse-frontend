import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Manufacturer } from './manufacturer.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ManufacturersService {
  private baseUrl = `${environment.apiBaseUrl}/manufacturers`;

  constructor(private http: HttpClient) {}

  list(): Observable<Manufacturer[]> {
    return this.http.get<Manufacturer[]>(this.baseUrl);
  }

  get(id: number): Observable<Manufacturer> {
    return this.http.get<Manufacturer>(`${this.baseUrl}/${id}`);
  }

  create(manufacturer: Manufacturer): Observable<Manufacturer> {
    return this.http.post<Manufacturer>(this.baseUrl, manufacturer);
  }

  update(id: number, manufacturer: Manufacturer): Observable<Manufacturer> {
    return this.http.put<Manufacturer>(`${this.baseUrl}/${id}`, manufacturer);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

