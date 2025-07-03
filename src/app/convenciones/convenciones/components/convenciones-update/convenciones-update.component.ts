import { DatePipe, Location } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormUtils } from '@core/utils/form-utils';
import { CdnService } from '@shared/services/cdn.service';
import { ConvencionesService } from '../../services/convenciones.service';
import { NotificacionService } from '@shared/services/notificacion.service';
import { ActivatedRoute } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { tap } from 'rxjs';

@Component({
  selector: 'evento-update',
  imports: [ReactiveFormsModule, NotFoundComponent],
  providers: [DatePipe],
  templateUrl: './convenciones-update.component.html',
})
export class ConvencionesUpdateComponent {
  location = inject(Location);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  cdnService = inject(CdnService);
  notificacion = inject(NotificacionService);
  convencionesService = inject(ConvencionesService);
  datePipe = inject(DatePipe);
  formUtils = FormUtils;

  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  convencionId = this.route.snapshot.params['id'];
  isEditMode = !!this.convencionId;

  myForm: FormGroup = this.fb.group({
    id: [0],
    nombreEvento: ['', Validators.required],
    subtitulo: [''],
    activo: [true, Validators.required],
    fecha_inicio: ['', Validators.required],
    fecha_fin: ['', Validators.required],
    direccion: [''],
    imagen: [null, Validators.required],
    url: [''],
    latitud: ['', Validators.required],
    longitud: ['', Validators.required],
    lugarDestino: ['', Validators.required],
  });

  convencionResource = this.isEditMode
    ? rxResource({
        request: () => ({}),
        loader: () =>
          this.convencionesService.obtieneConvencion(this.convencionId).pipe(
            tap((resp) => {
              if (!resp.status) {
                throw new Error(resp.message?.[0] || 'Error desconocido');
              }
            })
          ),
      })
    : null;

  constructor() {
    effect(() => {
      if (this.isEditMode) {
        const convencion = this.convencionResource!.value();
        console.log('convencionResource: ', convencion);
        if (convencion?.status) {
          this.llenaFormulario(convencion?.response);
        }
      }
    });
  }

  private llenaFormulario(convencion: any) {
    this.myForm.patchValue({
      id: convencion.id,
      nombreEvento: convencion.nombreEvento,
      subtitulo: convencion.subtitulo,
      activo: convencion.activo,
      fecha_inicio: this.datePipe.transform(
        new Date(convencion.fecha_inicio),
        'yyyy-MM-dd'
      ),
      fecha_fin: this.datePipe.transform(
        new Date(convencion.fecha_fin),
        'yyyy-MM-dd'
      ),
      direccion: convencion.direccion,
      imagen: convencion.imagen,
      url: convencion.imagen,
      latitud: convencion.latitud,
      longitud: convencion.longitud,
      lugarDestino: convencion.lugarDestino,
    });
    this.imagePreview = convencion.imagen;
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
      this.cdnService
        .uploadFile('convencionista', nombreImagen, file)
        .subscribe({
          next: (data) => {
            this.myForm.patchValue({
              url: data.response,
            });
          },
          error: (e) => {
            this.notificacion.show(
              'Ocurrio un error al cargar la foto de la convención, favor de intentarlo nuevamente',
              'error'
            );
          },
          complete: () => {
            this.registraConvencion();
          },
        });
    } else {
      this.registraConvencion();
    }
  }

  registraConvencion() {
    const request$ = this.isEditMode
      ? this.convencionesService.actualizaConvencion(this.myForm.value)
      : this.convencionesService.nuevaConvencion(this.myForm.value);
    request$.subscribe({
      next: (data) => {
        if (data.status) {
          this.notificacion.show(
            this.isEditMode
              ? 'Convención actualizada correctamente.'
              : 'Convención guardada correctamente.',
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
            ? 'Ocurrio un error al actualizar la convención, favor de intentarlo nuevamente'
            : 'Ocurrio un error a guardar la convención, favor de intentarlo nuevamente',
          'error'
        );
      },
    });
  }

  goBack() {
    this.location.back();
  }
}
