import { DatePipe, Location } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormUtils } from '@core/utils/form-utils';
import { UsuariosService } from '../../services/usuarios.service';
import { NotificacionService } from '@shared/services/notificacion.service';
import { ActivatedRoute } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { map, tap } from 'rxjs';
import { RolesService } from '../../services/roles.service';

@Component({
  selector: 'app-usuarios-update',
  imports: [ReactiveFormsModule, NotFoundComponent],
  templateUrl: './usuarios-update.component.html',
})
export class UsuariosUpdateComponent {
  location = inject(Location);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  notificacion = inject(NotificacionService);
  usuariosService = inject(UsuariosService);
  rolesService = inject(RolesService);
  formUtils = FormUtils;

  userName = this.route.snapshot.params['username'];
  isEditMode = !!this.userName;

  myForm: FormGroup = this.fb.group({
    userName: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
    activo: [true],
    roles: [],
  });

  usuarioResource = this.isEditMode
    ? rxResource({
        request: () => ({}),
        loader: () =>
          this.usuariosService.obtieneUsuario(this.userName).pipe(
            tap((resp) => {
              if (!resp.status) {
                throw new Error(resp.message?.[0] || 'Error desconocido');
              }
            })
          ),
      })
    : null;

  // rolesResource = rxResource({
  //   loader: ({}) => {
  //     return this.rolesService
  //       .obtieneRoles()
  //       .pipe(map((resp) => resp.response));
  //   },
  // });

  constructor() {
    effect(() => {
      if (this.isEditMode) {
        const usuario = this.usuarioResource!.value();
        if (usuario?.status) {
          this.llenaFormulario(usuario?.response);
        }
      }
    });
  }

  private llenaFormulario(usuario: any) {
    this.myForm.patchValue({
      userName: usuario.nombreUsuario,
      firstName: usuario.nombre,
      lastName: usuario.apellidos,
      activo: usuario.activo,
      email: usuario.email,
      password: usuario.password,
      roles: usuario.roles,
    });
  }

  onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    this.registraConvencion();
  }

  registraConvencion() {
    const request$ = this.isEditMode
      ? this.usuariosService.actualizaUsuario(this.myForm.value)
      : this.usuariosService.nuevoUsuario(this.myForm.value);
    request$.subscribe({
      next: (data) => {
        if (data.status) {
          this.notificacion.show(
            this.isEditMode
              ? 'Usuario actualizado correctamente.'
              : 'Usuario guardado correctamente.',
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
            ? 'Ocurrio un error al actualizar el usuario, favor de intentarlo nuevamente'
            : 'Ocurrio un error a guardar el usuario, favor de intentarlo nuevamente',
          'error'
        );
      },
    });
  }

  goBack() {
    this.location.back();
  }
}
