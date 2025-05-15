import { Injectable, signal } from '@angular/core';
export type TipoAlerta = 'success' | 'error' | 'info' | 'warning';

@Injectable({ providedIn: 'root' })

export class NotificacionService {
  _mensaje = signal<string | null>(null);
  _tipo = signal<TipoAlerta>('info');

  show(mensaje: string, tipo: TipoAlerta = 'info') {
    this._mensaje.set(mensaje);
    this._tipo.set(tipo);
    setTimeout(() => {
      this.mensaje.set(null);
    }, 5000);
  }

  get mensaje() {
    return this._mensaje;
  }

  get tipo() {
    return this._tipo;
  }
}
