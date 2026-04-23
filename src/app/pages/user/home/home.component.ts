import { environment } from '@/assets/environments/environment';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TitleComponent } from '@/shared/components/title/title.component';

@Component({
  selector: 'page-home',
  imports: [TranslatePipe, RouterLink, ButtonModule, TitleComponent],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent {
  environment = environment;
}
