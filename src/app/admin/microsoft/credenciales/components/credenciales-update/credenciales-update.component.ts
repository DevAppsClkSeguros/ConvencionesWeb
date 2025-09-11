import { Component, effect, inject } from '@angular/core';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormUtils } from '@core/utils/form-utils';
import { rxResource } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NotificacionService } from '@shared/services/notificacion.service';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { CredencialesService } from '../../services/credenciales.service';
import { Credencial } from '../../interfaces/credenciales.interface';


@Component({
  selector: 'app-credenciales-update',
  imports: [ReactiveFormsModule, NotFoundComponent, CommonModule],
  templateUrl: './credenciales-update.component.html',
})
export class CredencialesUpdateComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  location = inject(Location);
  notificacion = inject(NotificacionService);
  credencialesService = inject(CredencialesService);
  moduloId = this.route.snapshot.params['id'];
  formUtils = FormUtils;

  myForm: FormGroup = this.fb.group({
    id: [0],
    tenantId: ['', Validators.required],
    clientId: ['', Validators.required],
    scope: ['', Validators.required],
    grantType: ['', Validators.required],
    clientSecret: ['', Validators.required],
    userId: ['', Validators.required],
    email: ['', Validators.required],
  });

  credencialesResource = rxResource({
        request: () => ({ id: this.moduloId }),
        loader: ({ request }) =>
          this.credencialesService
            .obtieneCredencial('medios@grupobituaj.com.mx')
            .pipe(
              tap((resp) => {
                if (!resp.status) {
                  throw new Error(resp.message?.[0] || 'Error desconocido');
                }
              })
            ),
      });

  constructor() {
    if (this.credencialesResource) {
      effect(() => {
        const data = this.credencialesResource!.value();
        if (data?.status) {
          this.llenaFormulario(data.response);
        }
      });
    }
  }

  private llenaFormulario(credencial: Credencial): void {
    this.myForm.patchValue({
      id: credencial.id,
      tenantId: credencial.tenantId,
      clientId: credencial.clientId,
      scope: credencial.scope,
      grantType: credencial.grantType,
      clientSecret: credencial.clientId,
      userId: credencial.userId,
      email: credencial.email,
    });
  }

  onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    console.log('Formulario enviado:', this.myForm.value);
    this.registraModulo();
  }

  registraModulo() {
    const request$ = this.credencialesService.actualizaCredenciales(
      this.myForm.value
    );
    request$.subscribe({
      next: (data) => {
        if (data.status) {
          this.notificacion.show('Credenciales actualizadas correctamente.',
            'success'
          );
          this.location.back();
        } else {
          this.notificacion.show(data.message?.[0], 'error');
        }
      },
      error: (e) => {
        this.notificacion.show('Ocurrio un error al actualizar las credenciales, favor de intentarlo nuevamente',
          'error'
        );
      },
    });
  }

  goBack() {
    this.location.back();
  }
}
