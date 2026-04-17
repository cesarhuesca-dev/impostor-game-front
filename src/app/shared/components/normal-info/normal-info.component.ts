import { Game } from '@/interfaces/game.interface';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 's-normal-info',
  imports: [TranslatePipe],
  templateUrl: './normal-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NormalInfoComponent {
  readonly game = input.required<Game>();

  showWord = false;
}
