import { Component, effect, input, output, signal } from '@angular/core';

@Component({
  selector: 'shared-search-input',
  imports: [],
  templateUrl: './search-input.component.html',
})
export class SearchInputComponent {
  placerholder = input('Buscar..');
  value = output<string>();
  debounceTime = input(300);

  inputValue = signal<string>('');
  debounceEffect = effect((onCleanUp) => {
    const value = this.inputValue();
    const timeOut = setTimeout(() => {
      this.value.emit(value);
    }, this.debounceTime());
    onCleanUp(() => {
      clearTimeout(timeOut);
    });
  });
}
