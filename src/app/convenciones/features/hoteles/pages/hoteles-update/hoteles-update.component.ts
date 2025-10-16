import { Component, effect, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs';
import { CdnService } from '@shared/services/cdn.service';
import { ConvencionesService } from '@convenciones/features/convenciones/services/convenciones.service';
import { ConvencionistasPorConvencionComponent } from '@shared/pages/convencionistas-por-convencion/convencionistas-por-convencion.component';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';
import { FormUtils } from '@core/utils/form-utils';
import { HotelesService } from '../../services/hoteles.service';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { NotificacionService } from '@shared/services/notificacion.service';
import { UploadFileComponent } from '@shared/components/upload-file/upload-file.component';
import type { Hotel } from '../../interfaces/hoteles.interface';
import { MapaSelectorComponent } from "@convenciones/components/mapa-selector/mapa-selector.component";

@Component({
  selector: 'app-hoteles-update',
  imports: [
    NotFoundComponent,
    ReactiveFormsModule,
    ConvencionistasPorConvencionComponent,
    UploadFileComponent,
    FormErrorLabelComponent,
    MapaSelectorComponent,
  ],
  templateUrl: './hoteles-update.component.html',
})
export class HotelesUpdateComponent {
  convencionesService = inject(ConvencionesService);
  hotelesService = inject(HotelesService);
  notificacion = inject(NotificacionService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  cdnService = inject(CdnService);
  location = inject(Location);
  formUtils = FormUtils;
  imagePreview: string | null = null;
  hotelId = this.route.snapshot.params['id'];
  isEditMode = !!this.hotelId;
  convencionId = signal<number>(0);
  coordenadasDefault = signal({ lat: 19.4280468, lng: -99.2423326 });

  myForm: FormGroup = this.fb.group({
    id: [0],
    nombreHotel: ['', Validators.required],
    telefono: ['', Validators.required],
    direccion: ['', Validators.required],
    latitud: ['', Validators.required],
    longitud: ['', Validators.required],
    imagen: [null, Validators.required],
    url: [''],
    eventoId: ['', Validators.required],
    detalles: [''],
    convencionistasIds: [[], FormUtils.arrayRequired()],
  });

  hotelResource = this.isEditMode
    ? rxResource({
        loader: () => {
          return this.hotelesService.obtieneHotel(this.hotelId).pipe(
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

  constructor() {
    if (this.isEditMode && this.hotelResource) {
      effect(() => {
        const data = this.hotelResource!.value();
        if (data?.status) {
          this.llenaFormulario(data.response);
        }
      });
    }
    this.myForm.get('eventoId')?.valueChanges.subscribe((eventoId) => {
      this.convencionId.set(eventoId);
    });
  }

  private llenaFormulario(hotel: Hotel): void {
    this.myForm.patchValue({
      id: hotel.id,
      nombreHotel: hotel.nombreHotel,
      telefono: hotel.telefono,
      direccion: hotel.direccion,
      latitud: hotel.latitud,
      longitud: hotel.longitud,
      imagen: hotel.imagen,
      url: hotel.imagen,
      eventoId: hotel.eventoId,
      detalles: hotel.detalles,
      convencionistasIds: hotel.convencionistasIds,
    });
    this.coordenadasDefault.set({
      lat: Number(hotel.latitud),
      lng: Number(hotel.longitud),
    });
    this.imagePreview = hotel.imagen;
    this.convencionId.set(hotel.eventoId);
  }

  onFileSelected(file: File | null): void {
    this.myForm.patchValue({
      imagen: file,
      url: '',
    });
    this.myForm.get('imagen')?.markAsTouched();
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
      this.cdnService.uploadFile('hotel', nombreImagen, file).subscribe({
        next: (data) => {
          this.myForm.patchValue({
            url: data.response,
          });
        },
        error: (e) => {
          this.notificacion.show(
            'Ocurrio un error al cargar la foto del hotel, favor de intentarlo nuevamente',
            'error'
          );
        },
        complete: () => {
          this.registraHotel();
        },
      });
    } else {
      this.registraHotel();
    }
  }

  registraHotel() {
    const request$ = this.isEditMode
      ? this.hotelesService.actualizaHotel(this.myForm.value)
      : this.hotelesService.nuevoHotel(this.myForm.value);
    request$.subscribe({
      next: (data) => {
        if (data.status) {
          this.notificacion.show(
            this.isEditMode
              ? 'Hotel actualizado correctamente.'
              : 'Hotel guardado correctamente.',
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
            ? 'Ocurrio un error al actualizar el hotel, favor de intentarlo nuevamente'
            : 'Ocurrio un error a guardar el hotel, favor de intentarlo nuevamente',
          'error'
        );
      },
    });
  }

  seleccionaConvencionista(convencionistas: number[]) {
    this.myForm.patchValue({
      convencionistasIds: convencionistas,
    });
  }
  capturaCoordenadas(coordenadas: any) {
    console.log('Valor Emitido: ', coordenadas);
    this.myForm.patchValue({
      latitud: coordenadas.lat,
      longitud: coordenadas.lng,
    });
  }

  goBack() {
    this.location.back();
  }
}
