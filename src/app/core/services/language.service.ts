import { computed, inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { TranslateService } from '@ngx-translate/core';
import { LoaderService } from './loader.service';
import { SupportedLanguages } from 'src/app/core/enums/languages.enum';
import { SettingsService } from './utils/settings.service';
import { Settings } from '@/interfaces/configuration-app.interface';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private cookieService = inject(CookieService);
  private translateService = inject(TranslateService);
  private settingsService = inject(SettingsService);
  private loadingService = inject(LoaderService);

  private readonly settings = computed(() => this.settingsService.getSettings());

  get language() {
    return this.settings()?.language;
  }

  get suportedLanguages() {
    return SupportedLanguages;
  }

  loadLanguage() {
    if (!this.settings() || !this.settings()!.language) {
      this.setLanguage(SupportedLanguages.EN);
    } else {
      this.setLanguage(this.settings()!.language);
    }
  }

  setLanguage(lng: SupportedLanguages) {
    if (!this.settings()) return;

    const newConfig: Settings = {
      ...this.settings()!,
      language: lng,
    };

    this.settingsService.setSettings(newConfig);
    this.translateService.setFallbackLang(lng);
    this.translateService.use(lng);
  }
}
