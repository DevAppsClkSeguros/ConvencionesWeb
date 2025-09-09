import { Component, effect, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Location } from '@angular/common';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ConvencionesService } from 'src/app/convenciones/convenciones/services/convenciones.service';
import { NotificacionService } from '@shared/services/notificacion.service';
import { ActivatedRoute } from '@angular/router';
import { CdnService } from '@shared/services/cdn.service';
import { FormUtils } from '@core/utils/form-utils';
import { map, tap } from 'rxjs';
import { RecomendacionesService } from '../../services/recomendaciones.service';
import type { Recomendacion } from '../../interfaces/recomendaciones.interface';
import { CategoriasService } from '../../services/categorias.service';

@Component({
  selector: 'app-recomendaciones-update',
  imports: [NotFoundComponent, ReactiveFormsModule],
  templateUrl: './recomendaciones-update.component.html',
})
export class RecomendacionesUpdateComponent {
  convencionesService = inject(ConvencionesService);
  categoriasService = inject(CategoriasService);
  recomendacionesService = inject(RecomendacionesService);
  notificacion = inject(NotificacionService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  cdnService = inject(CdnService);
  location = inject(Location);
  formUtils = FormUtils;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  recomendacionId = this.route.snapshot.params['id'];
  isEditMode = !!this.recomendacionId;

  myForm: FormGroup = this.fb.group({
    id: [0],
    titulo: ['', Validators.required],
    informacion: ['', Validators.required],
    latitud: ['', Validators.required],
    longitud: ['', Validators.required],
    imagen: [null, Validators.required],
    url: [''],
    eventoId: ['', Validators.required],
    categoria_RecomendacionId: ['', Validators.required],
  });

  recomendacionResource = this.isEditMode
    ? rxResource({
        loader: () => {
          return this.recomendacionesService
            .obtieneRecomendacion(this.recomendacionId)
            .pipe(
              tap((resp) => {
                if (!resp.status) {
                  throw new Error(resp.message?.[0] || 'Error desconocido');
                }
              })
            );
        },
      })
    : null;

  convencionesResource = rxResource({
    loader: ({}) => {
      return this.convencionesService
        .obtieneConvenciones()
        .pipe(map((resp) => resp.response));
    },
  });

  categoriasResource = rxResource({
    loader: ({}) => {
      return this.categoriasService
        .obtieneCategorias()
        .pipe(map((resp) => resp.response));
    },
  });

  constructor() {
    if (this.isEditMode && this.recomendacionResource) {
      effect(() => {
        const data = this.recomendacionResource!.value();
        if (data?.status) {
          this.llenaFormulario(data.response);
        }
      });
    }
  }

  private llenaFormulario(recomendacion: any): void {
    console.log('Convencionista a llenar el formulario: ', recomendacion);
    this.myForm.patchValue({
      id: recomendacion.id,
      titulo: recomendacion.titulo,
      informacion: recomendacion.informacion,
      latitud: recomendacion.latitud,
      longitud: recomendacion.longitud,
      imagen: recomendacion.imagen,
      url: recomendacion.imagen,
      eventoId: recomendacion.eventoId,
      categoria_RecomendacionId: recomendacion.categoria_RecomendacionId,
    });
    this.imagePreview = `${recomendacion.imagen}?n=${Math.random()}`;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      if (!this.selectedFile.type.match('image.*')) {
        alert('Solo se permiten imágenes');
        return;
      }
      this.myForm.patchValue({
        imagen: this.selectedFile,
        url: '',
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
    this.myForm.patchValue({
      imagen: null,
      url: null,
    });
    this.myForm.get('imagen')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    if (this.myForm.get('imagen')?.value && !this.myForm.get('url')?.value) {
      const nombreImagen = `${this.myForm.get('id')?.value}-${String(
        Date.now()
      ).substring(0, 10)}`;
      const file: File = this.myForm.controls['imagen'].value;
      this.cdnService
        .uploadFile('recomendacion', nombreImagen, file)
        .subscribe({
          next: (data) => {
            this.myForm.patchValue({
              url: data.response,
            });
          },
          error: (e) => {
            this.notificacion.show(
              'Ocurrio un error al cargar la foto de la recomendación, favor de intentarlo nuevamente',
              'error'
            );
          },
          complete: () => {
            this.registraRecomendacion();
          },
        });
    } else {
      this.registraRecomendacion();
    }
  }

  registraRecomendacion() {
    const request$ = this.isEditMode
      ? this.recomendacionesService.actualizaRecomendacion(this.myForm.value)
      : this.recomendacionesService.nuevaRecomendacion(this.myForm.value);
    request$.subscribe({
      next: (data) => {
        if (data.status) {
          this.notificacion.show(
            this.isEditMode
              ? 'Recomendación actualizada correctamente.'
              : 'Recomendación guardada correctamente.',
            'success'
          );
          this.location.back();
        } else {
          this.notificacion.show(`Error ${data.message[0]}`, 'error');
        }
      },
      error: (e) => {
        this.notificacion.show(
          this.isEditMode
            ? 'Ocurrio un error al actualizar la recomendación, favor de intentarlo nuevamente'
            : 'Ocurrio un error a guardar la recomendación, favor de intentarlo nuevamente',
          'error'
        );
      },
    });
  }

  goBack() {
    this.location.back();
  }
}
