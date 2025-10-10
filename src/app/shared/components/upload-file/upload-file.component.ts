import { Component, input, output, signal, computed } from '@angular/core';

@Component({
  selector: 'shared-upload-file',
  standalone: true,
  templateUrl: './upload-file.component.html',
})
export class UploadFileComponent {
  preview = input<string | null>(null);
  imagen = output<File | null>();
  private filePreview = signal<string | null>(null);
  private cleared = signal(false);

  imagePreview = computed(() => {
    if (this.cleared()) return null;
    return this.filePreview() ?? this.preview() ?? null;
  });

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Solo se permiten imágenes');
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.filePreview.set(reader.result as string);
      this.cleared.set(false);
    };
    reader.readAsDataURL(file);

    this.imagen.emit(file);
  }

  limpiarImagen(inputRef: HTMLInputElement): void {
    inputRef.value = '';
    this.filePreview.set(null);
    this.cleared.set(true);
    this.imagen.emit(null);
  }
}
