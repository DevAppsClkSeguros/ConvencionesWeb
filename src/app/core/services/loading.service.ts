import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private _loading = signal(false);
  private _requests = signal(0);

  readonly isLoading = computed(() => this._loading());

  setLoading(value: boolean) {
    this._loading.set(value);
  }

  startRequest() {
    this._requests.update((n) => n + 1);
    this._loading.set(true);
  }

  endRequest() {
    this._requests.update((n) => Math.max(0, n - 1));
    if (this._requests() === 0) {
      this._loading.set(false);
    }
  }
}
