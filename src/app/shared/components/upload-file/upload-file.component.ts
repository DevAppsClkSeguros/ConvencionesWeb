import {
  Component,
  EventEmitter,
  Output,
  signal,
  input,
  effect,
} from '@angular/core';

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
  imagenUrl = signal<string | ArrayBuffer | null>(null);

  constructor() {
    console.log('Contructor');
    effect(() => {
      const currentPreview = this.preview();
      console.log('currentPreview: ', currentPreview);
      if (typeof currentPreview === 'string') {
        // Si es string (url), le metemos cache busting
        this.imagenUrl.set(`${currentPreview}?n=${Math.random()}`);
        console.log('this.imagenUrl: ', this.imagenUrl());
      } else {
        // Si es ArrayBuffer o null
        this.imagenUrl.set(currentPreview);
        console.log('this.array: ', this.imagenUrl());
      }
    });
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
        // this.imagenUrl.set(reader.result);
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
