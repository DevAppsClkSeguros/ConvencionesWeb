import { Location } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormUtils } from '@core/utils/form-utils';
import { PreguntasService } from '../../services/preguntas.service';
import { NotificacionService } from '@shared/services/notificacion.service';
import { tap } from 'rxjs';
import type { Pregunta } from '../../interfaces/preguntas.interface';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';

@Component({
  selector: 'app-preguntas-update',
  imports: [ReactiveFormsModule, NotFoundComponent],
  templateUrl: './preguntas-update.component.html',
})
export class PreguntasUpdateComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  location = inject(Location);
  preguntasService = inject(PreguntasService);
  notificacion = inject(NotificacionService);

  preguntaId = this.route.snapshot.params['id'];
  isEditMode = !!this.preguntaId;
  formUtils = FormUtils;

  myForm: FormGroup = this.fb.group({
    id: [0],
    texto: ['', Validators.required],
  });

  preguntaResource = this.isEditMode
    ? rxResource({
        request: () => ({}),
        loader: () => {
          return this.preguntasService.obtienePregunta(this.preguntaId).pipe(
            tap((resp) => {
              if (resp.status) {
                throw new Error(resp.message?.[0] || 'Error desconocido');
              }
            })
          );
        },
      })
    : null;

  constructor() {
    if (this.isEditMode && this.preguntaResource) {
      effect(() => {
        const data = this.preguntaResource!.value();
        if (data?.status) {
          this.llenaFormulario(data.response[0]);
        }
      });
    }
  }

  private llenaFormulario(pregunta: Pregunta) {
    this.myForm.patchValue({
      id: pregunta.id,
      texto: pregunta.texto,
    });
  }

  onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    this.registraPregunta();
  }

  registraPregunta() {
    const request$ = this.isEditMode
      ? this.preguntasService.actualizaPregunta(this.myForm.value)
      : this.preguntasService.nuevaPregunta(this.myForm.value);
    request$.subscribe({
      next: (data) => {
        if (data.status) {
          this.notificacion.show(
            this.isEditMode
              ? 'Pregunta actualizada correctamente.'
              : 'Pregunta guardada correctamente.',
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
            ? 'Ocurrio un error al actualizar la pregunta, favor de intentarlo nuevamente'
            : 'Ocurrio un error a guardar la pregunta, favor de intentarlo nuevamente',
          'error'
        );
      },
    });
  }

  goBack() {
    this.location.back();
  }
}
