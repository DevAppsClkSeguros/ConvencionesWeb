import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Location } from '@angular/common';
import { ConvencionistasService } from '../../services/convencionistas.service';
import { FormUtils } from '../../../../core/utils/form-utils';

@Component({
  selector: 'convencionistas-update',
  imports: [ReactiveFormsModule],
  templateUrl: './convencionistas-update.component.html',
})
export class ConvencionistasUpdateComponent implements OnInit {
  private fb = inject(FormBuilder);
  location = inject(Location);
  formUtils = FormUtils;
  convencionistasService = inject(ConvencionistasService);

  myForm: FormGroup = this.fb.group({
    id: [0],
    clave: ['', [Validators.required, Validators.minLength(5)]],
    nombreCompleto: ['', Validators.required],
    puesto: ['', Validators.required],
    telefono: [''],
    imagen: [''],
    perfil: [''],
    categoria: [''],
    convencion: [''],
  });

  ngOnInit(): void {}

  getPerfiles() {}

  getCategorias() {}

  getConvenciones() {}

  onFileSelected($event: Event) {
    throw new Error('Method not implemented.');
  }

  onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    this.convencionistasService
      .NuevoConvencionista(this.myForm.value)
      .subscribe({
        next: (data) => {
          if (data.status) {
            this.location.back();
          }
        },
      });
  }

  goBack() {
    this.location.back();
  }
}
