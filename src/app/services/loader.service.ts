import { Injectable, signal } from '@angular/core';

@Injectable({providedIn: 'root'})
export class LoaderService {

  private loader = signal<number>(0);

  get loading() : boolean {
    return (this.loader() > 0) ? true : false;
  }

  addLoading(delayMs: number = 0){
    setTimeout(() => this.loader.update(old => old = old + 1), delayMs);
  }

  finishLoading(delayMs: number = 0){
    setTimeout(() => this.loader.update(old => old = old - 1), delayMs);
  }

}
