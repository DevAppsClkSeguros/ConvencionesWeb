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
import { RolesService } from '../../../services/roles.service';

@Component({
  selector: 'app-roles-update',
  imports: [NotFoundComponent, ReactiveFormsModule],
  templateUrl: './roles-update.component.html',
})
export class RolesUpdateComponent {
  rolesService = inject(RolesService);
  notificacion = inject(NotificacionService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  location = inject(Location);
  formUtils = FormUtils;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  rolId = this.route.snapshot.params['id'];
  isEditMode = !!this.rolId;

  myForm: FormGroup = this.fb.group({
    id: [0],
    name: ['', Validators.required],
  });

  rolesResource = this.isEditMode
    ? rxResource({
        loader: () => {
          return this.rolesService.obtieneRol(this.rolId).pipe(
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
    if (this.isEditMode && this.rolesResource) {
      effect(() => {
        const data = this.rolesResource!.value();
        if (data?.status) {
          this.llenaFormulario(data.response);
        }
      });
    }
  }

  private llenaFormulario(rol: any): void {
    this.myForm.patchValue({
      id: rol.id,
      name: rol.name,
    });
    this.imagePreview = rol.imagen;
  }

  onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    this.registraRol();
  }

  registraRol() {
    const request$ = this.isEditMode
      ? this.rolesService.actualizaRol(this.myForm.value)
      : this.rolesService.nuevoRol(this.myForm.value);
    request$.subscribe({
      next: (data) => {
        if (data.status) {
          this.notificacion.show(
            this.isEditMode
              ? 'Rol actualizado correctamente.'
              : 'Rol guardado correctamente.',
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
            ? 'Ocurrió un error al actualizar el rol, favor de intentarlo nuevamente'
            : 'Ocurrió un error al guardar el rol, favor de intentarlo nuevamente',
          'error'
        );
      },
    });
  }

  goBack() {
    this.location.back();
  }
}
