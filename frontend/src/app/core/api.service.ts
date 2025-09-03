import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.apiBaseUrl || '';

  constructor(private http: HttpClient) {}

  private url(path: string) {
    // remove leading slash if base already ends with one
    if (!path) return this.base;
    const p = path.startsWith('/') ? path : `/${path}`;
    return `${this.base}${p}`;
  }

  get<T>(
    path: string,
    params?: HttpParams | { [param: string]: string | string[] }
  ): Observable<T> {
    return this.http.get<T>(this.url(path), { params: params as any });
  }

  post<T>(
    path: string,
    body: any,
    options?: { headers?: HttpHeaders }
  ): Observable<T> {
    return this.http.post<T>(this.url(path), body, options);
  }

  put<T>(
    path: string,
    body: any,
    options?: { headers?: HttpHeaders }
  ): Observable<T> {
    return this.http.put<T>(this.url(path), body, options);
  }

  delete<T>(path: string, options?: { params?: HttpParams }): Observable<T> {
    return this.http.delete<T>(this.url(path), options);
  }
}
