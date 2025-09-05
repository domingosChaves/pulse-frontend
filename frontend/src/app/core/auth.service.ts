import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface AuthUser {
  id: number | string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  token: string;
  user?: AuthUser;
}

export interface RegisterPayload {
  name: string;
  email: string;
  username: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'auth_token';
  private readonly redirectKey = 'post_login_redirect';
  private currentUser$ = new BehaviorSubject<AuthUser | null>(null);
  private isReady$ = new BehaviorSubject<boolean>(false);
  private readonly apiBase = environment.apiBaseUrl?.replace(/\/$/, '') || '';

  constructor(private http: HttpClient) {
    const token = this.getToken();
    if (token) {
      this.fetchMe().subscribe({
        next: () => this.isReady$.next(true),
        error: () => {
          this.logout();
          this.isReady$.next(true);
        },
      });
    } else {
      this.isReady$.next(true);
    }
  }

  get ready$(): Observable<boolean> {
    return this.isReady$.asObservable();
  }
  get user$(): Observable<AuthUser | null> {
    return this.currentUser$.asObservable();
  }
  get user(): AuthUser | null {
    return this.currentUser$.value;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  setRedirectAfterLogin(url: string) {
    localStorage.setItem(this.redirectKey, url);
  }
  consumeRedirectAfterLogin(): string | null {
    const url = localStorage.getItem(this.redirectKey);
    if (url) localStorage.removeItem(this.redirectKey);
    return url;
  }

  private url(path: string): string {
    const p = path.startsWith('/') ? path : `/${path}`;
    return `${this.apiBase}${p}`;
  }

  login(username: string, password: string): Observable<AuthUser | null> {
    return this.http
      .post<AuthResponse>(this.url('/auth/login'), { username, password })
      .pipe(
        tap((res) => this.storeToken(res.token)),
        tap((res) => {
          if (res.user) this.currentUser$.next(res.user);
        }),
        map((res) => res.user ?? null)
      );
  }

  startSocial(provider: 'google' | 'github') {
    const redirectUri = `${window.location.origin}/auth/callback`;
    const authUrl = `${this.url(
      '/auth/oauth/authorize'
    )}?provider=${provider}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = authUrl;
  }

  handleCallback(query: { [k: string]: string | null }): Observable<boolean> {
    const token = query['token'];
    if (token) {
      this.storeToken(token);
      return this.fetchMe().pipe(map(() => true));
    }

    const code = query['code'];
    const provider = (query['provider'] ||
      this.extractProviderFromState(query['state'])) as
      | 'google'
      | 'github'
      | null;
    if (code && provider) {
      return this.http
        .post<AuthResponse>(this.url('/auth/oauth/callback'), {
          code,
          provider,
        })
        .pipe(
          tap((res) => this.storeToken(res.token)),
          switchMap(() => this.fetchMe()),
          map(() => true),
          catchError(() => of(false))
        );
    }

    return of(false);
  }

  private extractProviderFromState(state: string | null): string | null {
    if (!state) return null;
    try {
      const parsed = JSON.parse(decodeURIComponent(state));
      return parsed.provider || null;
    } catch {
      return null;
    }
  }

  fetchMe(): Observable<AuthUser> {
    return this.http
      .get<AuthUser>(this.url('/auth/me'))
      .pipe(tap((u) => this.currentUser$.next(u)));
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.currentUser$.next(null);
  }

  private storeToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  register(payload: RegisterPayload): Observable<boolean> {
    return this.http
      .post<AuthResponse | { success?: boolean }>(
        this.url('/auth/register'),
        payload
      )
      .pipe(
        tap((res: any) => {
          if (res?.token) {
            this.storeToken(res.token);
          }
        }),
        switchMap((res: any) => {
          if (res?.token) {
            return this.fetchMe().pipe(map(() => true));
          }
          return of(!!res?.success);
        }),
        catchError(() => of(false))
      );
  }
}
