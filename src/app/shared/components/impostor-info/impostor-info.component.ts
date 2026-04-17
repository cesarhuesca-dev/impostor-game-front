import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 's-impostor-info',
  imports: [TranslatePipe],
  templateUrl: './impostor-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImpostorInfoComponent {}
