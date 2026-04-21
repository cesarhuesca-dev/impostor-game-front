import { inject, Injectable, signal } from '@angular/core';
import { PlayerService } from './player.service';

@Injectable({ providedIn: 'root' })
export class CloseGameService {
  private playerService = inject(PlayerService);

  private readonly startedSignal = signal<boolean>(false);
  private readonly showSignal = signal<boolean>(false);

  get started() {
    return this.startedSignal;
  }

  get show() {
    return this.showSignal;
  }

  startClosedGame() {
    this.startedSignal.update(() => true);
    setTimeout(() => this.showSignal.update(() => true), 500);
  }

  finishClosedGame() {
    this.showSignal.update(() => false);
    setTimeout(() => this.startedSignal.update(() => false), 500);
  }
}
