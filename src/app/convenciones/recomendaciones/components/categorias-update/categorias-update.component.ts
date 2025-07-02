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
import { NotificacionService } from '@shared/services/notificacion.service';
import { ActivatedRoute } from '@angular/router';
import { CdnService } from '@shared/services/cdn.service';
import { FormUtils } from '@core/utils/form-utils';
import { tap } from 'rxjs';
import { RecomendacionesService } from '../../services/recomendaciones.service';
import { CategoriasService } from '../../services/categorias.service';

@Component({
  selector: 'app-categorias-update',
  imports: [NotFoundComponent, ReactiveFormsModule],
  templateUrl: './categorias-update.component.html',
})
export class CategoriasUpdateComponent {
  categoriasService = inject(CategoriasService);
  recomendacionesService = inject(RecomendacionesService);
  notificacion = inject(NotificacionService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  location = inject(Location);
  formUtils = FormUtils;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  categoriaId = this.route.snapshot.params['id'];
  isEditMode = !!this.categoriaId;

  myForm: FormGroup = this.fb.group({
    id: [0],
    nombre: ['', Validators.required],
    activo: [true],
  });

  categoriasResource = this.isEditMode
    ? rxResource({
        loader: () => {
          return this.categoriasService.obtieneCategoria(this.categoriaId).pipe(
            tap((resp) => {
              if (!resp.status) {
                throw new Error(resp.message?.[0] || 'Error desconocido');
              }
            })
          );
        },
      })
    : null;

  constructor() {
    if (this.isEditMode && this.categoriasResource) {
      effect(() => {
        const data = this.categoriasResource!.value();
        if (data?.status) {
          this.llenaFormulario(data.response);
        }
      });
    }
  }

  private llenaFormulario(categoria: any): void {
    this.myForm.patchValue({
      id: categoria.id,
      nombre: categoria.nombre,
      activo: categoria.activo,
    });
    this.imagePreview = categoria.imagen;
  }

  onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    this.registraActividad();
  }

  registraActividad() {
    const request$ = this.isEditMode
      ? this.categoriasService.actualizaCategoria(this.myForm.value)
      : this.categoriasService.nuevaCategoria(this.myForm.value);
    request$.subscribe({
      next: (data) => {
        if (data.status) {
          this.notificacion.show(
            this.isEditMode
              ? 'Categoría actualizada correctamente.'
              : 'Categoría guardada correctamente.',
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
            ? 'Ocurrio un error al actualizar la categoría, favor de intentarlo nuevamente'
            : 'Ocurrio un error a guardar la categoría, favor de intentarlo nuevamente',
          'error'
        );
      },
    });
  }

  goBack() {
    this.location.back();
  }
}
