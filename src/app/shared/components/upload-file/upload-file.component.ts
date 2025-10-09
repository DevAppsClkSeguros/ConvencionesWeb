import { Component, signal, input, effect, output } from '@angular/core';

@Component({
  selector: 'shared-upload-file',
  templateUrl: './upload-file.component.html',
})
export class UploadFileComponent {
  preview = input<string | ArrayBuffer | null>(null);
  imagen = output<File | null>();
  // fileInputRef!: HTMLInputElement;
  imagenUrl = signal<string | ArrayBuffer | null>(null);
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor() {
    console.log('Contructor');
    effect(() => {
      const currentPreview = this.preview();
      console.log('currentPreview: ', currentPreview);
      if (typeof currentPreview === 'string') {
        this.imagenUrl.set(`${currentPreview}?n=${Math.random()}`);
        this.imagePreview = `${currentPreview}?n=${Math.random()}`;
        console.log('this.imagenUrl: ', this.imagenUrl());
      } else {
        this.imagenUrl.set(currentPreview);
        this.imagePreview = currentPreview;
        console.log('this.array: ', this.imagenUrl());
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      if (!this.selectedFile.type.match('image.*')) {
        alert('Solo se permiten imágenes');
        return;
      }
      this.previewImage(this.selectedFile);
      this.imagen.emit(this.selectedFile);
    }
  }

  private previewImage(file: File): void {
    const reader = new FileReader();
    console.log('File: ', file);
    reader.onload = (e: any) => {
      this.imagePreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  limpiarImagen(inputRef: HTMLInputElement): void {
    this.imagePreview = null;
    inputRef.value = '';
    this.selectedFile = null;
    this.imagen.emit(null);
  }
}
