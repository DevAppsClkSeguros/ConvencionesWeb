import { Component, effect, inject, signal } from '@angular/core';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormUtils } from '@core/utils/form-utils';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NotificacionService } from '@shared/services/notificacion.service';
import { ConvencionesService } from 'src/app/convenciones/convenciones/services/convenciones.service';
import { DatePipe, Location } from '@angular/common';
import { Convencion } from 'src/app/convenciones/convenciones/interfaces/convenciones.interface';
import { CommonModule } from '@angular/common';
import { ConvencionistasPorConvencionComponent } from '@shared/pages/convencionistas-por-convencion/convencionistas-por-convencion.component';
import { ActividadesService } from '../../services/actividades.service';

@Component({
  selector: 'app-actividades-update',
  imports: [
    ReactiveFormsModule,
    NotFoundComponent,
    CommonModule,
    ConvencionistasPorConvencionComponent,
  ],
  templateUrl: './actividades-update.component.html',
  providers: [DatePipe],
})
export class ActividadesUpdateComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  location = inject(Location);
  notificacion = inject(NotificacionService);
  convencionesService = inject(ConvencionesService);
  convenciones = signal<Convencion[]>([]);
  convencionId = signal<number | null>(null);
  actividadesService = inject(ActividadesService);
  actividadId = this.route.snapshot.params['id'];
  isEditMode = !!this.actividadId;
  formUtils = FormUtils;
  datePipe = inject(DatePipe);
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  myForm: FormGroup = this.fb.group({
    id: [''],
    titulo: ['', Validators.required],
    subtitulo: ['', Validators.required],
    fecha: ['', Validators.required],
    imagen: [null],
    url: [''],
    eventoId: ['', Validators.required],
    categoria_ActividadesId: ['', Validators.required],
    especificaciones: ['', Validators.required],
    convencionistasIds: [''],
  });

  actividadesResource = this.isEditMode
    ? rxResource({
        request: () => ({ id: this.actividadId }),
        loader: ({ request }) =>
          this.actividadesService.obtieneActividad(this.actividadId).pipe(
            tap((resp) => {
              if (!resp.status) {
                throw new Error(resp.message?.[0] || 'Error desconocido');
              }
            })
          ),
      })
    : null;

  convencionesResource = rxResource({
    loader: ({}) => {
      return this.convencionesService
        .obtieneConvenciones()
        .pipe(map((resp) => resp.response));
    },
  });

  constructor() {
    if (this.isEditMode && this.actividadesResource) {
      effect(() => {
        const data = this.actividadesResource!.value();
        if (data?.status) {
          this.llenaFormulario(data.response);
        }
      });
    }
    this.myForm.get('eventoId')?.valueChanges.subscribe((eventoId) => {
      console.log('Evento seleccionado: ', eventoId);
      this.convencionId.set(eventoId);
    });
  }

  private llenaFormulario(actividad: any): void {
    this.myForm.patchValue({
      id: actividad.id,
      titulo: actividad.titulo,
      subtitulo: actividad.subtitulo,
      fecha:
        this.datePipe.transform(
          new Date(actividad.fecha),
          'yyyy-MM-ddTHH:mm'
        ) || '',
      imagen: actividad.imagen,
      url: actividad.imagen,
      eventoId: actividad.eventoId,
      categoria_ActividadesId: actividad.categoria_ActividadesId,
      especificaciones: actividad.especificaciones,
      convencionistasIds: actividad.convencionistasIds,
    });
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
    this.registraVuelo();
  }

  registraVuelo() {
    const request$ = this.isEditMode
      ? this.actividadesService.actualizaActividad(this.myForm.value)
      : this.actividadesService.nuevaActividad(this.myForm.value);
    request$.subscribe({
      next: (data) => {
        if (data.status) {
          this.notificacion.show(
            this.isEditMode
              ? 'Actividad actualizada correctamente.'
              : 'Actividad guardada correctamente.',
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
            ? 'Ocurrio un error al actualizar la actividad, favor de intentarlo nuevamente'
            : 'Ocurrio un error a guardar la actividad, favor de intentarlo nuevamente',
          'error'
        );
      },
    });
  }

  seleccionaConvencionista(convencionistas: number[]) {
    console.log('Seleccionando desde padre, ', convencionistas);
    this.myForm.patchValue({
      convencionistasIds: convencionistas,
    });
  }

  goBack() {
    this.location.back();
  }
}
