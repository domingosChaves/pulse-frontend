import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from './products.service';
import { Product } from './product.model';
import { ManufacturersService } from '../manufacturers/manufacturers.service';
import { Manufacturer } from '../manufacturers/manufacturer.model';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit {
  form: FormGroup;
  saving = false;
  error = '';
  id?: number;
  manufacturers: Manufacturer[] = [];

  constructor(
    private fb: FormBuilder,
    private service: ProductsService,
    private manufacturersService: ManufacturersService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.maxLength(100)]],
      descricao: ['', [Validators.maxLength(500)]],
      fabricanteId: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadManufacturers();
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = Number(idParam);
      this.load(this.id);
    }
  }

  loadManufacturers(): void {
    this.manufacturersService.list().subscribe({
      next: (list) => (this.manufacturers = list || []),
      error: () => (this.error = 'Falha ao carregar fabricantes.'),
    });
  }

  load(id: number): void {
    this.service.get(id).subscribe({
      next: (p: Product) => {
        // compat: se vier fabricante/manufacturer aninhado, extrair id
        const fabricanteId =
          p.fabricanteId ||
          (p.fabricante && p.fabricante.id) ||
          (p.manufacturer && p.manufacturer.id) ||
          null;
        this.form.patchValue({
          nome: p.nome,
          descricao: p.descricao || '',
          fabricanteId,
        });
      },
      error: () => (this.error = 'Falha ao carregar produto.'),
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.error = '';
    const payload: Product = this.form.value;

    const obs = this.id
      ? this.service.update(this.id, payload)
      : this.service.create(payload);
    obs.subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/products']);
      },
      error: () => {
        this.saving = false;
        this.error = 'Falha ao salvar produto.';
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/products']);
  }

  get nome() {
    return this.form.get('nome');
  }
  get descricao() {
    return this.form.get('descricao');
  }
  get fabricanteId() {
    return this.form.get('fabricanteId');
  }
}

