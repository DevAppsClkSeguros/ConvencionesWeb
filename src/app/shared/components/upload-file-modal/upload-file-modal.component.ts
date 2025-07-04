import { Component, EventEmitter, Output, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'shared-upload-file-modal',
  imports: [CommonModule],
  templateUrl: './upload-file-modal.component.html',
})
export class UploadFileModalComponent {
  archivosSeleccionados = signal<File[]>([]);

  @Output() cerrarModal = new EventEmitter<void>();
  @Output() subirArchivos = new EventEmitter<File[]>();

  seleccionarArchivos(event: Event) {
    const target = event.target as HTMLInputElement;
    const archivos = target.files;
    if (!archivos) return;

    const archivosArray = Array.from(archivos);
    this.archivosSeleccionados.set(archivosArray);
  }

  cargar() {
    if (this.archivosSeleccionados().length > 0) {
      this.subirArchivos.emit(this.archivosSeleccionados());
      this.cerrarModal.emit(); // cerrar después de cargar
    }
  }

  cancelar() {
    this.cerrarModal.emit();
  }
}
