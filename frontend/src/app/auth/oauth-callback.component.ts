import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-oauth-callback',
  templateUrl: './oauth-callback.component.html',
})
export class OAuthCallbackComponent implements OnInit {
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const qp = this.route.snapshot.queryParamMap;
    const query: { [k: string]: string | null } = {};
    qp.keys.forEach((k) => (query[k] = qp.get(k)));

    this.auth.handleCallback(query).subscribe((ok: boolean) => {
      if (ok) {
        const go = this.auth.consumeRedirectAfterLogin() || '/';
        this.router.navigateByUrl(go);
      } else {
        this.error = true;
        this.router.navigate(['/login'], { queryParams: { error: 1 } });
      }
    });
  }
}
