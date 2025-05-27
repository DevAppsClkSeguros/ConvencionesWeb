import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'evento-update',
  imports: [ReactiveFormsModule],
  templateUrl: './convenciones-update.component.html',
})
export class ConvencionesUpdateComponent {
  location = inject(Location);

  eventoForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.eventoForm = this.fb.group({
      evento: ['', Validators.required],
      subtitulo: ['', Validators.required],
      fechaInicial: ['', Validators.required],
      fechaFinal: ['', Validators.required],
      estatus: [true, Validators.required],
      direccion: ['', Validators.required],
      latitud: ['', Validators.required],
      longitud: ['', Validators.required],
    });
  }

  guardar() {
    if (this.eventoForm.invalid) {
      this.eventoForm.markAllAsTouched();
      return;
    }

    console.log('Formulario enviado:', this.eventoForm.value);
    // Aquí mandas la info a donde te salga del forro 😎
  }
  goBack() {
    this.location.back();
  }
}
