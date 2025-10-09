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
import { FormUtils } from '@core/utils/form-utils';
import { tap } from 'rxjs';
import { PerfilesService } from '../../../services/perfiles.service';

@Component({
  selector: 'app-perfiles-update',
  imports: [NotFoundComponent, ReactiveFormsModule],
  templateUrl: './perfiles-update.component.html',
})
export class PerfilesUpdateComponent {
  perfilesService = inject(PerfilesService);
  notificacion = inject(NotificacionService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  location = inject(Location);
  formUtils = FormUtils;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  perfilId = this.route.snapshot.params['id'];
  isEditMode = !!this.perfilId;

  myForm: FormGroup = this.fb.group({
    id: [0],
    nombre: ['', Validators.required],
    activo: [true],
  });

  perfilesResource = this.isEditMode
    ? rxResource({
        loader: () => {
          return this.perfilesService.obtienePerfil(this.perfilId).pipe(
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
    if (this.isEditMode && this.perfilesResource) {
      effect(() => {
        const data = this.perfilesResource!.value();
        if (data?.status) {
          this.llenaFormulario(data.response);
        }
      });
    }
  }

  private llenaFormulario(perfil: any): void {
    this.myForm.patchValue({
      id: perfil.id,
      nombre: perfil.nombre,
      activo: perfil.activo,
    });
    this.imagePreview = perfil.imagen;
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
      ? this.perfilesService.actualizaPerfil(this.myForm.value)
      : this.perfilesService.nuevoPerfil(this.myForm.value);
    request$.subscribe({
      next: (data) => {
        if (data.status) {
          this.notificacion.show(
            this.isEditMode
              ? 'Perfil actualizado correctamente.'
              : 'Perfil guardado correctamente.',
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
            ? 'Ocurrió un error al actualizar el perfil, favor de intentarlo nuevamente'
            : 'Ocurrió un error al guardar el perfil, favor de intentarlo nuevamente',
          'error'
        );
      },
    });
  }

  goBack() {
    this.location.back();
  }
}
