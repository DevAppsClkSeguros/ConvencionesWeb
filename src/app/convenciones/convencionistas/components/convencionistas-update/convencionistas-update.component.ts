import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'convencionistas-update',
  imports: [ReactiveFormsModule],
  templateUrl: './convencionistas-update.component.html',
})
export class ConvencionistasUpdateComponent implements OnInit {

  private fb = inject(FormBuilder);
  myForm: FormGroup = this.fb.group({
    clave: ['', [Validators.required, Validators.minLength(5)]],
    name: ['', Validators.required],
    puesto: ['', Validators.required],
    telefono: [''],
    perfil: [''],
    categoria: [''],
    convencion: ['']
  });

  ngOnInit(): void {

  }

  getPerfiles() {

  }

  getCategorias() {

  }

  getConvenciones() {

  }

  onFileSelected($event: Event) {
    throw new Error('Method not implemented.');
  }

  onSubmit() {
    this.myForm.markAllAsTouched();
  }
}
