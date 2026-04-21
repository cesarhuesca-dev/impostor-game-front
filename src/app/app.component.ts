import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './shared/components/navigation/navigation.component';
import { LanguageService } from '@/services/language.service';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { MessagesComponent } from './shared/components/messages/messages.component';
import { PlayerService } from '@/services/player.service';
import { SettingsService } from '@/services/utils/settings.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavigationComponent, LoaderComponent, MessagesComponent],
  templateUrl: './app.component.html',
})
export class App implements OnInit {
  private settingsService = inject(SettingsService);
  private languageService = inject(LanguageService);
  private playerService = inject(PlayerService);

  protected readonly title = signal('game-impostor');

  constructor() {
    effect(() => {
      console.log('----CAMBIOS----');
      console.log('IDIOMA ACTUAL ->', this.languageService.language);
      console.log('Player info ->', this.playerService.playerData);
    });
  }

  ngOnInit(): void {
    this.settingsService.loadSettings();
    this.languageService.loadLanguage();
    this.playerService.loadPlayerData();
  }
}
