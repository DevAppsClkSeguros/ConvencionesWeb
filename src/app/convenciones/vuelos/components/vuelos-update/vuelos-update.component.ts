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
import { VuelosService } from '../../services/vuelos.service';
import { DatePipe, Location } from '@angular/common';
import { Convencion } from 'src/app/convenciones/convenciones/interfaces/convenciones.interface';
import { CommonModule } from '@angular/common';
import { ConvencionistasPorConvencionComponent } from "@shared/pages/convencionistas-por-convencion/convencionistas-por-convencion.component";

@Component({
  selector: 'app-vuelos-update',
  imports: [
    ReactiveFormsModule,
    NotFoundComponent,
    CommonModule,
    ConvencionistasPorConvencionComponent,
  ],
  templateUrl: './vuelos-update.component.html',
  providers: [DatePipe],
})
export class VuelosUpdateComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  location = inject(Location);
  notificacion = inject(NotificacionService);
  convencionesService = inject(ConvencionesService);
  convenciones = signal<Convencion[]>([]);
  convencionId = signal<number | null>(null);
  vuelosService = inject(VuelosService);
  vueloId = this.route.snapshot.params['id'];
  isEditMode = !!this.vueloId;
  formUtils = FormUtils;
  datePipe = inject(DatePipe);

  myForm: FormGroup = this.fb.group({
    id: [0],
    fecha_Vuelo: ['', Validators.required],
    reservacion: ['', Validators.required],
    numero_Vuelo: ['', Validators.required],
    asiento: ['', Validators.required],
    origen: ['', Validators.required],
    lugar_Origen: ['', Validators.required],
    hora_Salida: ['', Validators.required],
    destino: ['', Validators.required],
    lugar_Destino: ['', Validators.required],
    hora_Llegada: ['', Validators.required],
    detalle: [''],
    eventoId: ['', Validators.required],
    convencionistasIds: [],
  });

  vueloResource = this.isEditMode
    ? rxResource({
        request: () => ({ id: this.vueloId }),
        loader: ({ request }) =>
          this.vuelosService.obtieneVuelo(this.vueloId).pipe(
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
    if (this.isEditMode && this.vueloResource) {
      effect(() => {
        const data = this.vueloResource!.value();
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

  private llenaFormulario(vuelo: any): void {
    console.log('vuelo a llenar el formulario: ', vuelo);
    this.myForm.patchValue({
      id: vuelo.id,
      fecha_Vuelo: this.datePipe.transform(
        new Date(vuelo.fecha_Vuelo),
        'yyyy-MM-dd'
      ),
      reservacion: vuelo.reservacion,
      numero_Vuelo: vuelo.numero_Vuelo,
      asiento: vuelo.asiento,
      origen: vuelo.origen,
      lugar_Origen: vuelo.lugar_Origen,
      hora_Salida: vuelo.hora_Salida,
      destino: vuelo.destino,
      lugar_Destino: vuelo.lugar_Destino,
      hora_Llegada: vuelo.hora_Llegada,
      detalle: vuelo.detalle,
      eventoId: vuelo.eventoId,
      convencionistasIds: vuelo.convencionistasIds,
    });
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
      ? this.vuelosService.actualizaVuelo(this.myForm.value)
      : this.vuelosService.nuevoVuelo(this.myForm.value);
    request$.subscribe({
      next: (data) => {
        if (data.status) {
          this.notificacion.show(
            this.isEditMode
              ? 'Vuelo actualizado correctamente.'
              : 'Vuelo guardado correctamente.',
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
            ? 'Ocurrio un error al actualizar el vuelo, favor de intentarlo nuevamente'
            : 'Ocurrio un error a guardar el vuelo, favor de intentarlo nuevamente',
          'error'
        );
      },
    });
  }

  seleccionaConvencionista(convencionistas: number[]) {
    console.log('Seleccionando desde padre, ', convencionistas);
    this.myForm.patchValue({
      convencionistasIds: convencionistas
    });
  }

  goBack() {
    this.location.back();
  }
}
