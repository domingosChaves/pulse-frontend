import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

function genCorrelationId(): string {
  // UUID v4 simples (sem dependências)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

@Injectable()
export class ApiHttpInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let headers = req.headers.set('Accept', 'application/json');

    if (req.body && !headers.has('Content-Type')) {
      headers = headers.set('Content-Type', 'application/json');
    }

    // Authorization (opcional): pega de localStorage se existir
    const token = localStorage.getItem('auth_token');
    if (token && !headers.has('Authorization')) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    // X-Correlation-ID (opcional)
    if (!headers.has('X-Correlation-ID')) {
      headers = headers.set('X-Correlation-ID', genCorrelationId());
    }

    const cloned = req.clone({ headers });

    return next.handle(cloned).pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          // Log amigável e repasse do erro
          const payload = err.error;
          if (err.status === 400 || err.status === 404) {
            console.error('Erro API', {
              status: err.status,
              path: payload?.path,
              message: payload?.error || err.message,
              timestamp: payload?.timestamp,
            });
          }
        }
        return throwError(() => err);
      })
    );
  }
}
