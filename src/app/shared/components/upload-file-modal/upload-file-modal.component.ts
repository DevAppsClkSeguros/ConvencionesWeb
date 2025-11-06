import { Component, EventEmitter, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'shared-upload-file-modal',
  imports: [CommonModule],
  templateUrl: './upload-file-modal.component.html',
})
export class UploadFileModalComponent {
  cerrarModal = output<void>();
  subirArchivos = output<File[]>();
  tipoMultimedia = input<'Imagenes' | 'PDF'>('Imagenes');
  titulo = input<string>('Seleccionar archivos');
  archivosSeleccionados: File[] = [];

  seleccionarArchivos(event: Event) {
    const target = event.target as HTMLInputElement;
    const archivos = target.files;
    if (!archivos) return;
  }

  cargar() {}

  cancelar() {
    this.cerrarModal.emit();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    this.archivosSeleccionados = Array.from(input.files);
  }

  enviarArchivos() {
    if (this.archivosSeleccionados.length === 0) return;
    this.subirArchivos.emit(this.archivosSeleccionados);
    this.cerrarModal.emit();
  }
}
