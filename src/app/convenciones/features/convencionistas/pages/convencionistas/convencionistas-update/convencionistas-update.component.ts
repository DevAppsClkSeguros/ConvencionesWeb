import { Component, effect, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CategoriasService } from '../../../services/categorias.service';
import { CdnService } from '@shared/services/cdn.service';
import { ConvencionesService } from '@convenciones/features/convenciones/services/convenciones.service';
import { Convencionista } from '../../../interfaces/convencionistas.interface';
import { ConvencionistasService } from '../../../services/convencionistas.service';
import { FormUtils } from '@core/utils/form-utils';
import { map, tap } from 'rxjs';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { NotificacionService } from '@shared/services/notificacion.service';
import { PerfilesService } from '../../../services/perfiles.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { UploadFileComponent } from '@shared/components/upload-file/upload-file.component';
import type { Convencion } from '@convenciones/features/convenciones/interfaces/convenciones.interface';

@Component({
  selector: 'convencionistas-update',
  imports: [ReactiveFormsModule, NotFoundComponent, UploadFileComponent],
  templateUrl: './convencionistas-update.component.html',
})
export class ConvencionistasUpdateComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  location = inject(Location);
  cdnService = inject(CdnService);
  notificacion = inject(NotificacionService);
  convencionesService = inject(ConvencionesService);
  categoriasService = inject(CategoriasService);
  perfilesService = inject(PerfilesService);
  convenciones = signal<Convencion[]>([]);
  convencionistasService = inject(ConvencionistasService);
  convencionistaId = this.route.snapshot.params['id'];
  isEditMode = !!this.convencionistaId;
  formUtils = FormUtils;
  // selectedFile: File | null = null;
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
    perfilId: ['', Validators.required],
    categoriaId: ['', Validators.required],
    eventoId: ['', Validators.required],
    perfilNombre: [''],
    categoriaNombre: [''],
  });

  convencionistaResource = this.isEditMode
    ? rxResource({
        request: () => ({ id: this.convencionistaId }),
        loader: ({ request }) =>
          this.convencionistasService
            .obtieneConvencionista(this.convencionistaId)
            .pipe(
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

  categoriasResource = rxResource({
    loader: ({}) => {
      return this.categoriasService
        .obtieneCategorias()
        .pipe(map((resp: any) => resp.response));
    },
  });

  perfilesResouce = rxResource({
    loader: ({}) => {
      return this.perfilesService
        .obtienePerfiles()
        .pipe(map((resp: any) => resp.response));
    },
  });

  constructor() {
    if (this.isEditMode && this.convencionistaResource) {
      effect(() => {
        const data = this.convencionistaResource!.value();
        if (data?.status) {
          this.llenaFormulario(data.response);
        }
      });
    }
  }

  private llenaFormulario(convencionista: Convencionista): void {
    this.myForm.patchValue({
      id: convencionista.id,
      activo: convencionista.activo,
      clave: convencionista.clave,
      nombreCompleto: convencionista.nombreCompleto,
      puesto: convencionista.puesto,
      telefono: convencionista.telefono,
      imagen: convencionista.imagen,
      url: convencionista.imagen,
      perfilId: convencionista.perfilId,
      categoriaId: convencionista.categoriaId,
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

  onFileSelected(event: File | null): void {
    console.log("Mi archivo desde convencionistas: ", event)
    // const input = event.target as HTMLInputElement;
    // if (input.files && input.files.length > 0) {
    //   this.selectedFile = input.files[0];
    //   if (!this.selectedFile.type.match('image.*')) {
    //     alert('Solo se permiten imágenes');
    //     return;
    //   }
      this.myForm.patchValue({
        imagen: event,
        url: '',
      });
      console.log("myForm: ", this.myForm.value);
    //   this.myForm.get('imagen')?.markAsTouched();
    //   this.myForm.get('imagen')?.updateValueAndValidity();
    //   this.previewImage(this.selectedFile);
    // }
  }

  private previewImage(file: File): void {
    // const reader = new FileReader();
    // reader.onload = (e: any) => {
    //   this.imagePreview = e.target.result;
    // };
    // reader.readAsDataURL(file);
  }

    limpiarImagen(inputRef: HTMLInputElement): void {
    // this.imagePreview = null;
    // inputRef.value = '';
    // this.selectedFile = null;
    // this.myForm.patchValue({
    //   imagen: null,
    //   url: '',
    // });
    // this.myForm.get('imagen')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    if (this.myForm.get('imagen')?.value && !this.myForm.get('url')?.value) {
      const file: File = this.myForm.controls['imagen'].value;
      console.log("archivo a subir: ", file);
      const nombreImagen = `${this.myForm.get('clave')?.value}-${String(
        Date.now()
      ).substring(0, 10)}`;
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
              'Ocurrio un error al cargar la foto del convencionista, favor de intentarlo nuevamente',
              'error'
            );
          },
          complete: () => {
            this.registraConvencionista();
          },
        });
    } else {
      this.registraConvencionista();
    }
  }

  registraConvencionista() {
    const perfilId = this.myForm.get('perfilId')?.value;
    const perfil = this.perfilesResouce
      .value()
      .find((p: any) => p.id === Number(perfilId)).nombre;
    const categoriaId = this.myForm.get('categoriaId')?.value;
    const categoria = this.categoriasResource
      .value()
      .find((c: any) => c.id === Number(categoriaId)).nombre;
    this.myForm.patchValue({
      perfilNombre: perfil,
      categoriaNombre: categoria,
    });
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
