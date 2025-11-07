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
  isUploading = false;

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

  async startUpload() {
    this.isUploading = true;

    for (const upload of this.uploads) {
      upload.status = 'uploading';
      try {
        const tipoArchivo = upload.file.type;
        let carpetaDestino = 'imagenes';

        if (tipoArchivo.startsWith('image/')) {
          carpetaDestino = 'imagenes';
        } else if (tipoArchivo.startsWith('video/')) {
          carpetaDestino = 'videos';
        }
        const ruta = `Los Cabos/${carpetaDestino}/${upload.file.name}`;

        if (upload.file.size <= 4 * 1024 * 1024) {
          const res = await this.microsoftGraphService.uploadSmallFile(
            this.token,
            upload.file,
            ruta
          );
          upload.result = res;
          upload.progress = 100;
        } else {
          const session = await this.microsoftGraphService.createUploadSession(
            this.token,
            upload.file.name,
            `Los Cabos/${carpetaDestino}`
          );
          const completed =
            await this.microsoftGraphService.uploadLargeFileWithSession(
              session.uploadUrl,
              upload.file,
              (progress: number) => (upload.progress = progress)
            );
          upload.result = completed;
        }
        upload.status = 'done';
      } catch (err: any) {
        upload.error = err.message || 'Error desconocido';
        upload.status = 'error';
      }
    }

    this.isUploading = false;
    this.subirArchivos.emit(this.archivosSeleccionados);
  }

  onSubmit() {
    this.startUpload();
  }

  onClose() {
    if (!this.isUploading) this.cerrarModal.emit();
  }
}
