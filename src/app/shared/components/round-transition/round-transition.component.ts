import { Game } from '@/interfaces/game.interface';
import { RoundService } from '@/services/round.service';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 's-round-transition',
  imports: [TranslatePipe],
  templateUrl: './round-transition.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoundTransitionComponent {
  private roundService = inject(RoundService);

  readonly started = computed(() => this.roundService.started());
  readonly show = computed(() => this.roundService.show());
  readonly countdown = computed(() => this.roundService.countdown());

  readonly game = input.required<Game>();
}
