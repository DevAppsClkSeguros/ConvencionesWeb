import { Component, effect, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CdnService } from '@shared/services/cdn.service';
import { ConvencionesService } from 'src/app/convenciones/convenciones/services/convenciones.service';
import { FormUtils } from '@core/utils/form-utils';
import type { Hotel } from '../../interfaces/hoteles.interface';
import { HotelesService } from '../../services/hoteles.service';
import { NotFoundComponent } from "@shared/components/not-found/not-found.component";
import { NotificacionService } from '@shared/services/notificacion.service';

@Component({
  selector: 'app-hoteles-update',
  imports: [NotFoundComponent, ReactiveFormsModule],
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
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  hotelId = this.route.snapshot.params['id'];
  isEditMode = !!this.hotelId;

  myForm: FormGroup = this.fb.group({
    id: [0],
    nombreHotel: ['', Validators.required],
    telefono: ['', Validators.required],
    direccion: ['', Validators.required],
    latitud: ['', Validators.required],
    longitud: ['', Validators.required],
    imagen: [null, Validators.required],
    url: [''],
    eventoId: [0],
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
          this.llenaFormulario(data.response[0]);
        }
      });
    }
  }

  private llenaFormulario(hotel: Hotel): void {
    console.log('Convencionista a llenar el formulario: ', hotel);
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
    });
    this.imagePreview = hotel.imagen;
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
    if (this.myForm.get('imagen')?.value && !this.myForm.get('url')?.value) {
      const nombreImagen = `${this.myForm.get('id')?.value}-${String(
        Date.now()
      ).substring(0, 3)}`;
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

  goBack() {
    this.location.back();
  }
}
