import { inject, Injectable, signal } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Settings } from '@/interfaces/configuration-app.interface';
import { SupportedLanguages } from '@/enums/languages.enum';
import { OverlayPosition } from '@/enums/overlay.enum';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private cookieService = inject(CookieService);

  private readonly topicCookieSettings = 'settings';
  private readonly defaultConfiguration: Settings = {
    language: SupportedLanguages.EN,
    overlayPosition: OverlayPosition.BOTTOM_LEFT,
  };

  private readonly settings = signal<Settings>(this.defaultConfiguration);

  getSettings(): Settings | null {
    try {
      const settings = this.cookieService.check(this.topicCookieSettings)
        ? (JSON.parse(this.cookieService.get(this.topicCookieSettings)) as Settings)
        : null;

      return settings;
    } catch {
      return null;
    }
  }

  setSettings(newSettings: Settings) {
    this.settings.update(() => newSettings);
    this.cookieService.set(this.topicCookieSettings, JSON.stringify(this.settings()));
  }

  loadSettings() {
    const settings = this.getSettings();

    if (!settings) {
      this.setSettings(this.defaultConfiguration);
      return;
    }

    this.setSettings(settings!);
  }
}
