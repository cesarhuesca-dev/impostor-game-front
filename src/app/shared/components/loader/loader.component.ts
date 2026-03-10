import { LoaderService } from '@/services/loader.service';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 's-loader',
  imports: [TranslatePipe],
  templateUrl: './loader.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {

  private loaderService = inject(LoaderService);
  loading = computed(() => this.loaderService.loading);
}
