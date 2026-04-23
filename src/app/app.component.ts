import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './shared/components/navigation/navigation.component';
import { LanguageService } from '@/services/language.service';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { MessagesComponent } from './shared/components/messages/messages.component';
import { PlayerService } from '@/services/player.service';
import { SettingsService } from '@/services/utils/settings.service';
import { Meta, Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavigationComponent, LoaderComponent, MessagesComponent],
  templateUrl: './app.component.html',
})
export class App implements OnInit {
  private settingsService = inject(SettingsService);
  private languageService = inject(LanguageService);
  private playerService = inject(PlayerService);
  private translateService = inject(TranslateService);

  private meta = inject(Meta);
  private title = inject(Title);

  constructor() {
    this.translateService.get('title').subscribe((res) => {
      this.title.setTitle(res['home-page']);
      this.meta.updateTag({ property: 'og:title', content: res['home-page'] });
      this.meta.updateTag({ name: 'description', content: res['home-page-description'] });
      this.meta.updateTag({ property: 'og:description', content: res['home-page-description'] });
    });
  }

  ngOnInit(): void {
    this.settingsService.loadSettings();
    this.languageService.loadLanguage();
    this.playerService.loadPlayerData();
  }
}
