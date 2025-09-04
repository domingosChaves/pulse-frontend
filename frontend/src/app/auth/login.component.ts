import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  saving = false;
  error: string | null = null;

  form = this.fb.group({
    username: ['', [Validators.required, Validators.maxLength(100)]],
    password: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(200)],
    ],
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  submit() {
    this.error = null;
    if (this.form.invalid || this.saving) return;
    this.saving = true;
    const { username, password } = this.form.getRawValue();
    this.auth.login(username!, password!).subscribe({
      next: () => {
        const go = this.auth.consumeRedirectAfterLogin() || '/products';
        this.router.navigateByUrl(go);
      },
      error: (err: any) => {
        this.error =
          err?.error?.error || 'Falha no login. Verifique suas credenciais.';
        this.saving = false;
      },
      complete: () => (this.saving = false),
    });
  }

  loginWith(provider: 'google' | 'github') {
    this.auth.startSocial(provider);
  }
}
