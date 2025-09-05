import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService, AuthUser } from './core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'frontend';
  user$: Observable<AuthUser | null>;

  constructor(private auth: AuthService, private router: Router) {
    this.user$ = this.auth.user$;
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
