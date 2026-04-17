import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 's-inprogress-info',
  imports: [TranslatePipe],
  templateUrl: './inprogress-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InprogressInfoComponent {}
