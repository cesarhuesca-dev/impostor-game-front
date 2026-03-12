import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { form, FormField, required, min, minLength, validate } from '@angular/forms/signals';
import { ButtonModule } from 'primeng/button';
import { CreateGameInterface } from '@/interfaces/forms/game.interface';
import { GameService } from '@/services/game.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-create',
  imports: [ToggleSwitchModule, FormField, ButtonModule, TranslatePipe],
  templateUrl: './create.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CreateComponent implements OnInit {


  private gameService = inject(GameService);
  private translateService = inject(TranslateService);

  createGameModel = signal<CreateGameInterface>({
    roomName: '',
    roomPassword: '',
    players: 0,
    customWords: false,
    category: false,
    specificCategory: '',
    canMultipleImpostors: false,
    availableOverlay: false
  });

  createGameForm = form(this.createGameModel, (schemaPath) => {
    required(schemaPath.roomName, { message: 'forms.error.room-name-required' });
    minLength(schemaPath.roomName, 3, { message: 'forms.error.room-name-min-length' });

    required(schemaPath.roomPassword, { message: 'forms.error.room-password-required' });
    minLength(schemaPath.roomPassword, 3, { message: 'forms.error.room-password-min-length' });

    required(schemaPath.players, { message: 'room-players-required' });
    min(schemaPath.players, 3,{ message: 'forms.error.room-players-min' });

    validate(schemaPath.specificCategory, ({value, valueOf}) => {
      const category = valueOf(schemaPath.category);
      const specificCategory = value();

      if (category && (!specificCategory || specificCategory === '')) {
        return {
          kind: 'category-required',
          message: 'forms.error.room-specific-category-required',
        };
      }
      return null;
    });
  });

  gameCategories = signal<{code: string, value: string}[]>([]);

  ngOnInit(): void {
    this.setGameCategories();
  }

  setGameCategories(){
    this.translateService.get('game.categories').subscribe((res) => {

      const options = Object.keys(res).map( x => ({
        code : x,
        value : res[x]
      }));

      this.gameCategories.update(() => options)
    })
  }

  categoryToggle(){

    if(!this.createGameForm.category().value()){
      this.createGameModel.update(x => ({
        ...x,
        specificCategory: ''
      }));
    }

  }

  createGame() {

    if(!this.createGameForm().valid()){
      return;
    }

    const data = this.createGameForm().value();
    this.gameService.createGame(data);
  }


}
