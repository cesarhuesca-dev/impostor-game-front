import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from "./shared/components/navigation/navigation.component";
import { LanguageService } from '@/services/language.service';
import { LoaderComponent } from "./shared/components/loader/loader.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavigationComponent, LoaderComponent],
  templateUrl: './app.component.html'
})
export class App implements OnInit {

  private languageService = inject(LanguageService)

  protected readonly title = signal('game-impostor');


  ngOnInit(): void {
    this.languageService.loadLanguage();

    console.log('IDIOMA ACTUAL ->', this.languageService.currentLanguage)

  }

}
