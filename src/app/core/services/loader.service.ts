import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private readonly loader = signal<number>(0);

  get loading(): boolean {
    return this.loader() > 0 ? true : false;
  }

  addLoading(delayMs = 0) {
    setTimeout(() => this.loader.update((old) => old + 1), delayMs);
  }

  finishLoading(delayMs = 0) {
    setTimeout(() => this.loader.update((old) => old - 1), delayMs);
  }
}
