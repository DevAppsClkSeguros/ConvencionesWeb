import { Component, effect, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { JsonPipe, Location } from '@angular/common';
import { ConvencionistasService } from '../../services/convencionistas.service';
import { FormUtils } from '@core/utils/form-utils';
import { CdnService } from '@shared/services/cdn.service';
import { NotificacionService } from '@shared/services/notificacion.service';
import { ConvencionesService } from 'src/app/convenciones/convenciones/services/convenciones.service';
import { Convencion } from 'src/app/convenciones/convenciones/interfaces/convenciones.interface';
import { ActivatedRoute } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { map, tap } from 'rxjs';
import { CategoriasConvensionistaService } from 'src/app/convenciones/configuracion/categoriaConvencionista/services/categoriasConvencionista.service';
import { PerfilesConvensionistaService } from 'src/app/convenciones/configuracion/perfilConvencionista/services/perfilesConvencionista.service';

@Component({
  selector: 'convencionistas-update',
  imports: [ReactiveFormsModule, JsonPipe, NotFoundComponent],
  templateUrl: './convencionistas-update.component.html',
})
export class ConvencionistasUpdateComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  location = inject(Location);
  cdnService = inject(CdnService);
  notificacion = inject(NotificacionService);
  convencionesService = inject(ConvencionesService);
  categoriasConvencionistaService = inject(CategoriasConvensionistaService);
  perfilesConvencionistaService = inject(PerfilesConvensionistaService);
  convenciones = signal<Convencion[]>([]);
  convencionistasService = inject(ConvencionistasService);
  convencionistaId = this.route.snapshot.params['id'];
  isEditMode = !!this.convencionistaId;
  formUtils = FormUtils;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  myForm: FormGroup = this.fb.group({
    id: [0],
    activo: [true],
    clave: ['', [Validators.required, Validators.minLength(5)]],
    nombreCompleto: ['', Validators.required],
    puesto: ['', Validators.required],
    telefono: [''],
    imagen: [null],
    url: [''],
    documento: [''],
    perfilNombreId: 2,
    categoriaNombreId: 1,
    eventoId: 2,
  });

  convencionistaResource = this.isEditMode
    ? rxResource({
        request: () => ({ id: this.convencionistaId }),
        loader: ({ request }) =>
          this.convencionistasService
            .obtieneConvencionista(this.convencionistaId)
            .pipe(
              tap((resp) => {
                console.log('resp: ', resp);
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

  categoriasResource = rxResource({
    loader: ({}) => {
      return this.categoriasConvencionistaService
        .obtieneCategoriasConvencionista()
        .pipe(map((resp: any) => resp.response));
    },
  });

  perfilesResouce = rxResource({
    loader: ({}) => {
      return this.perfilesConvencionistaService
        .obtienePerfilesConvencionista()
        .pipe(map((resp: any) => resp.response));
    },
  });

  constructor() {
    console.log(
      'convencionistaResourceError: ',
      this.convencionistaResource?.error()
    );
    console.log(
      'convencionistaResourceValue: ',
      this.convencionistaResource?.value()
    );
    console.log('this.convencionistaId: ', this.convencionistaId);
    if (this.isEditMode && this.convencionistaResource) {
      effect(() => {
        const data = this.convencionistaResource!.value();
        if (data?.status) {
          this.llenaFormulario(data.response);
        }
      });
    }
  }

  private llenaFormulario(convencionista: any): void {
    console.log('Convencionista a llenar el formulario: ', convencionista);
    this.myForm.patchValue({
      id: convencionista.id,
      activo: convencionista.activo,
      clave: convencionista.clave,
      nombreCompleto: convencionista.nombreCompleto,
      puesto: convencionista.puesto,
      telefono: convencionista.telefono,
      imagen: convencionista.imagen,
      url: convencionista.imagen,
      perfilNombreId: convencionista.perfilNombreId,
      categoriaNombreId: convencionista.categoriaNombreId,
      eventoId: convencionista.eventoId,
    });
    this.imagePreview = convencionista.imagen;
  }

  // getConvenciones() {
  //   this.convencionesService.obtieneConvenciones().subscribe({
  //     next: (data) => {
  //       if (data.status) {
  //         this.convenciones.set(data.response);
  //       }
  //     },
  //     error: (e) => {
  //       this.notificacion.show(
  //         'Ocurrio un error al recuperar lista de convenciones',
  //         'error'
  //       );
  //     },
  //   });
  // }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Validaciones básicas del archivo
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
      url: '',
    });
    this.myForm.get('imagen')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    if (this.myForm.get('imagen')?.value && !this.myForm.get('url')?.value) {
      const file: File = this.myForm.controls['imagen'].value;
      const nombreImagen = `${this.myForm.get('clave')?.value}-${String(
        Date.now()
      ).substring(0, 3)}`;
      this.cdnService
        .uploadFile('convencionista', nombreImagen, file)
        .subscribe({
          next: (data) => {
            this.myForm.patchValue({
              url: data.response,
            });
          },
          error: (e) => {},
          complete: () => {
            this.registraConvencionista();
          },
        });
    } else {
      this.registraConvencionista();
    }
  }

  registraConvencionista() {
    const request$ = this.isEditMode
      ? this.convencionistasService.actualizaConvencionista(this.myForm.value)
      : this.convencionistasService.nuevoConvencionista(this.myForm.value);
    request$.subscribe({
      next: (data) => {
        if (data.status) {
          this.notificacion.show(
            this.isEditMode
              ? 'Convencionista actualizado correctamente.'
              : 'Convencionista guardado correctamente.',
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
            ? 'Ocurrio un error al actualizar el convencionista, favor de intentarlo nuevamente'
            : 'Ocurrio un error a guardar el convencionista, favor de intentarlo nuevamente',
          'error'
        );
      },
    });
  }

  goBack() {
    this.location.back();
  }
}
