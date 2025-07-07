import { Component, EventEmitter, Output, signal, input, effect } from '@angular/core';

@Component({
  selector: 'shared-upload-file',
  templateUrl: './upload-file.component.html',
})
export class UploadFileComponent {
  preview = input<string | ArrayBuffer | null>(null);
  @Output() imagenSeleccionada = new EventEmitter<{
    file: File | null;
    preview: string | ArrayBuffer | null;
  }>();

  fileInputRef!: HTMLInputElement;
  mathRandom = Math.random();
  imagen = '';

  constructor() {
    effect(() => {
      if (this.imagen) {
        `${this.imagen}?n=${Math.random()}`
      }
    })
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (!file.type.match('image.*')) {
        alert('Solo se permiten imágenes');
        this.limpiar();
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.imagenSeleccionada.emit({ file, preview: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }

  limpiar(): void {
    this.imagenSeleccionada.emit({ file: null, preview: null });
    if (this.fileInputRef) {
      this.fileInputRef.value = '';
    }
  }

  setInputRef(ref: HTMLInputElement) {
    this.fileInputRef = ref;
  }
}
