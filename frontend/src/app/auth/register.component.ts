import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';

function passwordsMatch(ctrl: AbstractControl): ValidationErrors | null {
  const pwd = ctrl.get('password')?.value;
  const rep = ctrl.get('confirmPassword')?.value;
  return pwd && rep && pwd !== rep ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  saving = false;
  error: string | null = null;

  form = this.fb.group(
    {
      name: ['', [Validators.required, Validators.maxLength(120)]],
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(160)],
      ],
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(60),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(120),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordsMatch }
  );

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  submit() {
    this.error = null;
    if (this.form.invalid || this.saving) return;
    this.saving = true;

    const { name, email, username, password } = this.form.getRawValue();
    this.auth
      .register({
        name: name!,
        email: email!,
        username: username!,
        password: password!,
      })
      .subscribe({
        next: (ok) => {
          // Se o backend retornar token, o serviço já armazena e busca o usuário; redireciona para home
          if (ok) {
            const go = this.auth.consumeRedirectAfterLogin() || '/products';
            this.router.navigateByUrl(go);
          } else {
            // fallback: redireciona ao login com flag
            this.router.navigate(['/login'], {
              queryParams: { registered: 1 },
            });
          }
        },
        error: (err: any) => {
          this.error =
            err?.error?.error || 'Falha no cadastro. Verifique os dados.';
          this.saving = false;
        },
        complete: () => (this.saving = false),
      });
  }
}
