import { GlobalSettings } from 'src/app/core/interfaces/configuration-app.interface';
import { computed, inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { GameService } from '@/services/game.service';
import { TranslateService } from '@ngx-translate/core';
import { LoaderService } from './loader.service';
import { SupportedLanguages } from 'src/app/core/enums/languages.enum';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private cookieService = inject(CookieService);
  private translateService = inject(TranslateService);
  private gameService = inject(GameService);
  private loadingSerice = inject(LoaderService);

  private defaultLanguage: SupportedLanguages = SupportedLanguages.ES;
  private supportedLangugaes = SupportedLanguages;

  readonly globalSettings = computed(() => this.gameService.configurationData().globalSettings);

  get supportedLanguages() {
    return this.supportedLangugaes;
  }

  get currentLanguage(): SupportedLanguages {
    return this.gameService.configurationData().globalSettings.language;
  }

  loadLanguage() {
    const currentLng = this.cookieService.check('settings')
      ? (JSON.parse(this.cookieService.get('settings')) as GlobalSettings).language
      : this.defaultLanguage;

    this.setLanguage(currentLng);
  }

  setLanguage(lng: SupportedLanguages) {
    const config = { ...this.gameService.configurationData() };

    if (!config) return;

    config.globalSettings.language = lng;

    this.gameService.setNewconfigurationApp(config);
    this.cookieService.set('settings', JSON.stringify(this.gameService.configurationData().globalSettings));

    this.translateService.setFallbackLang(lng);
    this.translateService.use(lng);
  }
}
