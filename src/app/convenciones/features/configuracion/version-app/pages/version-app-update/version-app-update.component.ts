import { Component, effect, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Location } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormUtils } from '@core/utils/form-utils';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { NotificacionService } from '@shared/services/notificacion.service';
import { VersionAppService } from '../../services/version-app.service';

@Component({
  selector: 'app-version-app-update',
  imports: [NotFoundComponent, ReactiveFormsModule],
  templateUrl: './version-app-update.component.html',
})
export class VersionAppUpdateComponent {
  versionAppService = inject(VersionAppService);
  notificacion = inject(NotificacionService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  location = inject(Location);
  formUtils = FormUtils;
  versionId = this.route.snapshot.params['id'];
  isEditMode = !!this.versionId;
  convencionId = signal<number>(0);

  myForm: FormGroup = this.fb.group({
    id: [0],
    version_Android: ['', Validators.required],
    version_IOs: ['', Validators.required],
    version_Huawei: ['', Validators.required],
  });

  versionResource = this.isEditMode
    ? rxResource({
        loader: () => {
          return this.versionAppService.obtieneVersiones().pipe(
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
    if (this.isEditMode && this.versionResource) {
      effect(() => {
        const data = this.versionResource!.value();
        if (data?.status) {
          this.llenaFormulario(data.response[0]);
        }
      });
    }
  }

  private llenaFormulario(version: any): void {
    this.myForm.patchValue({
      id: version.id,
      version_Android: version.version_Android,
      version_IOs: version.version_IOs,
      version_Huawei: version.version_Huawei,
    });
  }

  onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    this.registraVersion();
  }

  registraVersion() {
    this.versionAppService.actualizaVersion(this.myForm.value).subscribe({
      next: (data) => {
        if (data.status) {
          this.notificacion.show(
            'Versión actualizada correctamente.',
            'success'
          );
          this.location.back();
        } else {
          this.notificacion.show(`Error ${data.message[0]}`, 'error');
        }
      },
      error: (e) => {
        this.notificacion.show(
          'Ocurrio un error al actualizar la versión, favor de intentarlo nuevamente',
          'error'
        );
      },
    });
  }

  goBack() {
    this.location.back();
  }
}
