import { Component, ElementRef, input, output, ViewChild } from '@angular/core';

@Component({
  selector: 'shared-confirm-modal',
  templateUrl: './confirm-modal.component.html',
})

export class ConfirmModalComponent {
  titulo = input<string>('Confirmación');
  mensaje = input<string>('¿Estás seguro de que deseas continuar?');
  mensajeAceptar = input<string>('');
  confirmar = output<void>();
  cancelar = output<void>();

  @ViewChild('dialogRef') dialogRef!: ElementRef<HTMLDialogElement>;

  show() {
    this.dialogRef.nativeElement.showModal();
  }

  close() {
    this.dialogRef.nativeElement.close();
  }

  onCancel() {
    this.cancelar.emit();
    this.close();
  }

  onConfirm() {
    this.confirmar.emit();
    this.close();
  }
}
