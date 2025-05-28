import { Component, effect, inject, signal } from '@angular/core';
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
import { ConvencionesService } from 'src/app/convenciones/convenciones/services/convenciones.service';
import { Convencion } from 'src/app/convenciones/convenciones/interfaces/convenciones.interface';
import { ActivatedRoute } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';

@Component({
  selector: 'convencionistas-update',
  imports: [ReactiveFormsModule, JsonPipe, NotFoundComponent],
  templateUrl: './convencionistas-update.component.html',
})
export class ConvencionistasUpdateComponent {
  private fb = inject(FormBuilder);
  convencionistaId = inject(ActivatedRoute).snapshot.params['id'];
  location = inject(Location);
  cdnService = inject(CdnService);
  notificacion = inject(NotificacionService);
  convencionesService = inject(ConvencionesService);
  convenciones = signal<Convencion[]>([]);
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
    imagen: [null],
    url: [''],
    perfilConvencionistaId: 0,
    categoriaUsuarioId: 0,
    eventoId: 0,
  });

  convencionistaResource = rxResource({
    request: () => ({ id: this.convencionistaId }),
    loader: ({ request }) =>
      this.convencionistasService.GetConvencionista(this.convencionistaId),
  });

  convencionistaData = this.convencionistaResource.value; // Señal con los datos

  constructor() {
    effect(() => {
      const data = this.convencionistaData();
      if (data?.status) {
        // Solo si hay datos
        this.llenarFormulario(data.response);
        // this.loadImagePreview(data.imagen); // Si necesitas cargar la imagen
      }
    });
  }

  private llenarFormulario(convencionista: any): void {
    console.log('Convencionista a llenar el formulario: ', convencionista);
    this.myForm.patchValue({
      id: convencionista.id,
      clave: convencionista.clave,
      nombreCompleto: convencionista.nombreCompleto,
      puesto: convencionista.puesto,
      telefono: convencionista.telefono,
      imagen: convencionista.imagen, // Nombre del archivo o URL
      url: convencionista.url,
      perfilConvencionistaId: convencionista.perfilConvencionistaId,
      categoriaUsuarioId: convencionista.categoriaUsuarioId,
      eventoId: convencionista.eventoId,
    });
    this.imagePreview = convencionista.url;
  }

  getConvenciones() {
    this.convencionesService.getEventos().subscribe({
      next: (data) => {
        if (data.status) {
          this.convenciones.set(data.response);
        }
      },
      error: (e) => {
        this.notificacion.show(
          'Ocurrio un error al recuperar lista de convenciones',
          'error'
        );
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Validaciones básicas del archivo
      if (!this.selectedFile.type.match('image.*')) {
        alert('Solo se permiten imágenes');
        return;
      }
      this.myForm.patchValue({
        imagen: this.selectedFile,
      });
      this.myForm.get('imagen')?.markAsTouched();
      this.myForm.get('imagen')?.updateValueAndValidity();
      this.previewImage(this.selectedFile);
    }
  }

  private previewImage(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
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
      },
      error: (e) => {},
      complete: () => {
        this.convencionistasService
          .NuevoConvencionista(this.myForm.value)
          .subscribe({
            next: (data) => {
              if (data.status) {
                this.notificacion.show(
                  'Registro guardado correctamente.',
                  'success'
                );
                this.location.back();
              }
            },
            error: (e) => {
              this.notificacion.show(
                'Ocurrio un error a guardar el registro, favor de intentarlo nuevamente',
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
