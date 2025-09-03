import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ManufacturersService } from './manufacturers.service';
import { Manufacturer } from './manufacturer.model';

@Component({
  selector: 'app-manufacturer-form',
  templateUrl: './manufacturer-form.component.html',
  styleUrls: ['./manufacturer-form.component.scss']
})
export class ManufacturerFormComponent implements OnInit {
  form: FormGroup;
  saving = false;
  error = '';
  id?: number;

  constructor(
    private fb: FormBuilder,
    private service: ManufacturersService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.maxLength(100)]],
      descricao: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = Number(idParam);
      this.load(this.id);
    }
  }

  load(id: number): void {
    this.service.get(id).subscribe({
      next: (m: Manufacturer) => this.form.patchValue(m),
      error: () => this.error = 'Falha ao carregar fabricante.'
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.error = '';
    const payload: Manufacturer = this.form.value;

    const obs = this.id ? this.service.update(this.id, payload) : this.service.create(payload);
    obs.subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/manufacturers']);
      },
      error: () => {
        this.saving = false;
        this.error = 'Falha ao salvar fabricante.';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/manufacturers']);
  }

  get nome() { return this.form.get('nome'); }
  get descricao() { return this.form.get('descricao'); }
}

