import { Component, effect, input, output } from '@angular/core';

@Component({
  selector: 'shared-upload-file',
  imports: [],
  templateUrl: './upload-file.component.html',
})
export class UploadFileComponent {
  selectedFile: File | null = null;
  imagePreview = input<string | ArrayBuffer | null>(null);
  imagenSeleccionada = output<ArrayBuffer | null>();

  url: any;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      if (!this.selectedFile.type.match('image.*')) {
        alert('Solo se permiten imágenes');
        return;
      }
      this.url = this.selectedFile;
      console.log('Imagen en hijo: ', this.url);
      this.imagenSeleccionada.emit(this.url);
      this.previewImage(this.selectedFile);
    }
  }

  private previewImage(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.url = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  limpiarImagen(inputRef: HTMLInputElement): void {
    this.url = null;
    this.imagenSeleccionada.emit(null);
    inputRef.value = '';
    this.selectedFile = null;
  }

  constructor() {
    effect(() => {
      const imagen = this.imagePreview();
      if (imagen) {
        this.url = `${this.imagePreview()}?n=${Math.random()}`;
        console.log('imagen: ', this.url);
      }
    });
  }
}
