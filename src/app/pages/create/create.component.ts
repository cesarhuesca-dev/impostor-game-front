import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { form, FormField, required, min, minLength, validate, validateTree} from '@angular/forms/signals';
import { ButtonModule } from 'primeng/button';
import { CreateGameInterface } from '@/interfaces/forms/game.interface';
import { GameService } from '@/services/game.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { single } from 'rxjs';

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
    required(schemaPath.roomName);
    minLength(schemaPath.roomName, 3);

    required(schemaPath.roomPassword);
    minLength(schemaPath.roomPassword, 3);

    required(schemaPath.players);
    min(schemaPath.players, 3);

    validate(schemaPath.specificCategory, ({value, valueOf}) => {
      const category = valueOf(schemaPath.category);
      const specificCategory = value();

      if (category && (!specificCategory || specificCategory === '')) {
        return {
          kind: 'categoryRequired',
          message: 'Category is required',
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
