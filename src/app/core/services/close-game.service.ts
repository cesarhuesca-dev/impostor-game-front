import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CloseGameService {
  private readonly startedSignal = signal<boolean>(false);
  private readonly startedBannedSignal = signal<boolean>(false);
  private readonly showSignal = signal<boolean>(false);

  get started() {
    return this.startedSignal;
  }

  get startedBanned() {
    return this.startedBannedSignal;
  }

  get show() {
    return this.showSignal;
  }

  startClosedGame() {
    this.startedSignal.update(() => true);
    setTimeout(() => this.showSignal.update(() => true), 500);
  }

  startBannedClosedGame() {
    this.startedBannedSignal.update(() => true);
    setTimeout(() => this.showSignal.update(() => true), 500);
  }

  finishClosedGame() {
    this.showSignal.update(() => false);
    this.startedBannedSignal.update(() => false);
    setTimeout(() => this.startedSignal.update(() => false), 500);
  }
}
