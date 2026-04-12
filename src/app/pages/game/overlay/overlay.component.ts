import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AvatarsComponent } from '@/shared/components/avatars/avatars.component';
import { WordGameComponent } from '@/shared/components/word-game/word-game.component';
import { CommonModule } from '@angular/common';
import { SettingsService } from '@/services/settings.service';

@Component({
  selector: 'page-overlay',
  imports: [AvatarsComponent, WordGameComponent, CommonModule],
  templateUrl: './overlay.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class OverlayComponent {
  private settingsService = inject(SettingsService);
  readonly configuration = computed(() => this.settingsService.getSettings());
}
