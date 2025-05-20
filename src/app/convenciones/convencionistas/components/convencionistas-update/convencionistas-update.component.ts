import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { JsonPipe, Location } from '@angular/common';
import { ConvencionistasService } from '../../services/convencionistas.service';
import { FormUtils } from '@core/utils/form-utils';
import { CdnService } from '@shared/services/cdn.service';
import { NotificacionService } from '@shared/services/notificacion.service';

@Component({
  selector: 'convencionistas-update',
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './convencionistas-update.component.html',
})
export class ConvencionistasUpdateComponent implements OnInit {
  private fb = inject(FormBuilder);
  location = inject(Location);
  cdnService = inject(CdnService);
  notificacion = inject(NotificacionService);
  formUtils = FormUtils;
  convencionistasService = inject(ConvencionistasService);
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  myForm: FormGroup = this.fb.group({
    id: [0],
    clave: ['', [Validators.required, Validators.minLength(5)]],
    nombreCompleto: ['', Validators.required],
    puesto: ['', Validators.required],
    telefono: [''],
    imagen: [null, Validators.required],
    url: [''],
    perfilConvencionistaId: 0,
    categoriaUsuarioId: 0,
    eventoId: 0,
  });

  ngOnInit(): void {}

  getPerfiles() {}

  getCategorias() {}

  getConvenciones() {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Validaciones básicas del archivo
      if (!this.selectedFile.type.match('image.*')) {
        alert('Solo se permiten imágenes');
        return;
      }

      // Actualizar el formulario
      this.myForm.patchValue({
        imagen: this.selectedFile,
      });
      this.myForm.get('imagen')?.markAsTouched();
      this.myForm.get('imagen')?.updateValueAndValidity();

      // Opcional: Mostrar previsualización
      this.previewImage(this.selectedFile);
    }
  }

  private previewImage(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      // Aquí puedes asignar la imagen previsualizada a una propiedad
      // para mostrarla en el template si lo deseas
      this.imagePreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  limpiarImagen(inputRef: HTMLInputElement): void {
    this.imagePreview = null;
    inputRef.value = '';
    this.selectedFile = null;
    this.myForm.patchValue({ imagen: null });
    this.myForm.get('imagen')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    const file: File = this.myForm.controls['imagen'].value;
    this.cdnService.uploadFile('convencionista', 'imagen', file).subscribe({
      next: (data) => {
        this.myForm.patchValue({
          url: data.response,
        });
        console.log('Data de la imagen: ', data);
      },
      error: (e) => {},
      complete: () => {
        this.convencionistasService
          .NuevoConvencionista(this.myForm.value)
          .subscribe({
            next: (data) => {
              if (data.status) {
                this.notificacion.show(
                  'Convencionista guardado correctamente.',
                  'success'
                );
                this.location.back();
              }
            },
            error: (e) => {
              this.notificacion.show(
                'Ocurrio un error a guardar al convencionista, favor de intentarlo nuevamente',
                'error'
              );
            },
          });
      },
    });
  }

  goBack() {
    this.location.back();
  }
}
