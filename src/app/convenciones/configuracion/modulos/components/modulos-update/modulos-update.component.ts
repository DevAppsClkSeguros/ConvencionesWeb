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
import { DatePipe, Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ModulosService } from '../../services/modulos.service';

@Component({
  selector: 'app-modulos-update',
  imports: [ReactiveFormsModule, NotFoundComponent, CommonModule],
  templateUrl: './modulos-update.component.html',
  providers: [DatePipe],
})
export class ModulosUpdateComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  location = inject(Location);
  notificacion = inject(NotificacionService);
  modulosService = inject(ModulosService);
  moduloId = this.route.snapshot.params['id'];
  isEditMode = !!this.moduloId;
  formUtils = FormUtils;
  datePipe = inject(DatePipe);

  myForm: FormGroup = this.fb.group({
    id: [''],
    fMod: [''],
    masterKey: ['', Validators.required],
    keyCode: ['', Validators.required],
    descripcion: ['', Validators.required],
    status: [true],
    idTypeResp: [0],
    message: [''],
    fStart: [this.datePipe.transform(new Date(), 'yyyy-MM-dd')],
    fStop: [this.datePipe.transform(new Date(), 'yyyy-MM-dd')],
    statusPopUp: [false],
    idTypeRespPopUp: [0],
    messagePopUp: [''],
  });

  modulosResource = this.isEditMode
    ? rxResource({
        request: () => ({ id: this.moduloId }),
        loader: ({ request }) =>
          this.modulosService.obtieneModulo(this.moduloId).pipe(
            tap((resp) => {
              if (!resp.status) {
                throw new Error(resp.message?.[0] || 'Error desconocido');
              }
            })
          ),
      })
    : null;

  constructor() {
    if (this.isEditMode && this.modulosResource) {
      effect(() => {
        const data = this.modulosResource!.value();
        if (data?.status) {
          this.llenaFormulario(data.response);
        }
      });
    }
  }

  private llenaFormulario(modulo: any): void {
    this.myForm.patchValue({
      id: modulo.id,
      fMod: modulo.fMod,
      masterKey: modulo.masterKey,
      keyCode: modulo.keyCode,
      descripcion: modulo.descripcion,
      status: modulo.status,
      idTypeResp: modulo.idTypeResp,
      message: modulo.message,
      fStart:
        this.datePipe.transform(new Date(modulo.fStart), 'yyyy-MM-dd') ||
        '',
      fStop:
        this.datePipe.transform(new Date(modulo.fStop), 'yyyy-MM-dd') ||
        '',
      statusPopUp: modulo.statusPopUp,
      idTypeRespPopUp: modulo.idTypeRespPopUp,
      messagePopUp: modulo.messagePopUp,
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
    const request$ = this.isEditMode
      ? this.modulosService.actualizaModulo(this.myForm.value)
      : this.modulosService.nuevoModulo(this.myForm.value);
    request$.subscribe({
      next: (data) => {
        if (data.status) {
          this.notificacion.show(
            this.isEditMode
              ? 'Modulo actualizado correctamente.'
              : 'Modulo guardado correctamente.',
            'success'
          );
          this.location.back();
        } else {
          this.notificacion.show(data.message?.[0], 'error');
        }
      },
      error: (e) => {
        this.notificacion.show(
          this.isEditMode
            ? 'Ocurrio un error al actualizar el modulo, favor de intentarlo nuevamente'
            : 'Ocurrio un error al guardar el modulo, favor de intentarlo nuevamente',
          'error'
        );
      },
    });
  }

  goBack() {
    this.location.back();
  }
}
