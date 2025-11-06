import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MicrosoftGraphService } from '../../../convenciones/features/memorias-fotograficas/services/microsoftGraph.service';

interface FileUploadProgress {
  file: File;
  progress: number; // 0-100
  status: 'pending' | 'uploading' | 'done' | 'error';
  result?: any;
  error?: string;
}

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
  uploads: FileUploadProgress[] = [];
  private microsoftGraphService = inject(MicrosoftGraphService);
  token = ''; // obtenlo desde tu AuthService o similar

  seleccionarArchivos(event: Event) {
    const target = event.target as HTMLInputElement;
    const archivos = target.files;
    if (!archivos) return;
  }

  cargar() {}

  cancelar() {
    this.cerrarModal.emit();
  }

  enviarArchivos() {
    if (this.archivosSeleccionados.length === 0) return;
    // this.subirArchivos.emit(this.archivosSeleccionados);
    // this.cerrarModal.emit();
    this.enviarArchivosAlBackend(this.archivosSeleccionados);
  }

  async enviarArchivosAlBackend(archivos: File[]) {
    console.log('Archivos a subir:', archivos);
    try {
      const results = await this.microsoftGraphService.uploadFiles(
        this.token,
        archivos,
        'Los Cabos/imagenes'
      );
      console.log('Resultados de subida:', results);
      // Puedes emitir un evento al padre con los resultados
    } catch (err) {
      console.error('Error al subir archivos:', err);
      // Manejo de errores
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    this.archivosSeleccionados = Array.from(input.files);
    this.uploads = this.archivosSeleccionados.map((f) => ({
      file: f,
      progress: 0,
      status: 'pending',
    }));
  }

  async startUpload(token: string) {
    for (const upload of this.uploads) {
      upload.status = 'uploading';
      try {
        // Diferenciar tamaño como en servicio
        if (upload.file.size <= 4 * 1024 * 1024) {
          const res = await this.microsoftGraphService.uploadSmallFile(
            token,
            upload.file,
            `Los Cabos/imagenes/${upload.file.name}`
          );
          upload.result = res;
        } else {
          const session = await this.microsoftGraphService.createUploadSession(
            token,
            upload.file.name,
            'Los Cabos/imagenes'
          );
          const completed =
            await this.microsoftGraphService.uploadLargeFileWithSession(
              session.uploadUrl,
              upload.file
            );
          upload.result = completed;
        }
        upload.progress = 100;
        upload.status = 'done';
      } catch (err: any) {
        upload.error = err.message || 'Error desconocido';
        upload.status = 'error';
      }
    }
    // Emitir al padre los archivos que se subieron o con errores
    this.subirArchivos.emit(this.archivosSeleccionados);
  }

  onSubmit(token: string) {
    this.startUpload(token);
  }

  onClose() {
    this.cerrarModal.emit();
  }
}
