import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RoundService {
  private readonly numberCount = 5;

  private readonly startedSignal = signal<boolean>(false);
  private readonly showSignal = signal<boolean>(false);
  private readonly countdownSignal = signal<number>(this.numberCount);

  get started() {
    return this.startedSignal;
  }

  get show() {
    return this.showSignal;
  }

  get countdown() {
    return this.countdownSignal;
  }

  startCountdown() {
    this.start();
  }

  start() {
    this.startedSignal.update(() => true);
    setTimeout(() => this.countdownLoop(), 500);
  }

  countdownLoop() {
    this.countdown.update(() => this.numberCount);
    this.showSignal.update(() => true);

    const interval = setInterval(() => {
      this.countdown.update((old) => old - 1);

      if (this.countdown() === 0) {
        clearInterval(interval);
        this.finishCountdown();
      }
    }, 1000);
  }

  finishCountdown() {
    setTimeout(() => {
      this.showSignal.update(() => false);
      setTimeout(() => this.startedSignal.update(() => false), 300);
    }, 500);
  }
}
