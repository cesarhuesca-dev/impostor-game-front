import { ChangeDetectionStrategy, Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { form, FormField, required, min, minLength, validate, pattern } from '@angular/forms/signals';
import { ButtonModule } from 'primeng/button';
import { CreateGameInterface, LoginGameInterface } from 'src/app/core/interfaces/forms/game.interface';
import { GameService } from '@/services/game.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { UserModal } from "@/shared/components/user-modal/user-modal.component";
import { LoaderService } from '@/services/loader.service';
import { HandleResponseService } from '@/services/handle-response.service';
import { PlayerService } from '@/services/player.service';
import { Router } from '@angular/router';
import { UserModalInterface } from 'src/app/core/interfaces/forms/user-modal.interface';
import { AuxiliarService } from '@/services/auxiliar.service';
import { ItemListInterface } from '@/interfaces/list.interface';

@Component({
  selector: 'app-create',
  imports: [ToggleSwitchModule, FormField, ButtonModule, TranslatePipe, UserModal],
  templateUrl: './create.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CreateComponent implements OnInit {


  private userModal = viewChild.required(UserModal);

  private readonly gameService = inject(GameService);
  private readonly translateService = inject(TranslateService);
  private readonly loadingService = inject(LoaderService);
  private readonly handleResponseService = inject(HandleResponseService);
  private readonly playerService = inject(PlayerService)
  private readonly auxiliarService = inject(AuxiliarService)
  private readonly router = inject(Router)

  createGameModel = signal<CreateGameInterface>({
    roomName: '',
    roomPassword: '',
    roomPlayers: 0,
    customWords: false,
    specificCategory: false,
    category: '',
    multipleImpostors: false,
    overlay: false
  });

  createGameForm = form(this.createGameModel, (schemaPath) => {
    required(schemaPath.roomName, { message: 'forms.error.room-name-required' });
    minLength(schemaPath.roomName, 3, { message: 'forms.error.room-name-min-length' });

    required(schemaPath.roomPassword, { message: 'forms.error.room-password-required' });
    minLength(schemaPath.roomPassword, 5, { message: 'forms.error.room-password-min-length' });
    pattern(schemaPath.roomPassword, /^[A-Za-z0-9]{5,}$/, { message: 'forms.error.room-password-pattern' });

    required(schemaPath.roomPlayers, { message: 'room-players-required' });
    min(schemaPath.roomPlayers, 3,{ message: 'forms.error.room-players-min' });

    validate(schemaPath.specificCategory, ({valueOf}) => {
      const specificCategory = valueOf(schemaPath.specificCategory);
      const category = valueOf(schemaPath.category);

      if (specificCategory && (!category || category === '')) {
        return {
          kind: 'category-required',
          message: 'forms.error.room-specific-category-required',
        };
      }
      return null;
    });
  });

  gameCategories = signal<ItemListInterface[]>([]);

  ngOnInit(): void {
    this.setGameCategories();
  }

  clearForm = () => {
    this.createGameModel.update(() => ({
      roomName: '',
      roomPassword: '',
      roomPlayers: 0,
      customWords: false,
      specificCategory: false,
      category: '',
      multipleImpostors: false,
      overlay: false
    }));
  }

  setGameCategories(){

    this.loadingService.addLoading();
    this.auxiliarService.getCategories().subscribe(categories => {

       this.gameCategories.update(() => categories)
      this.loadingService.finishLoading();

    });
  }

  categoryToggle(){

    if(!this.createGameForm.specificCategory().value()){
      this.createGameModel.update(x => ({
        ...x,
        category: ''
      }));
    }
  }

  createGame() {

    if(!this.createGameForm().valid()){
      return;
    }

    const data = this.createGameForm().value();

    this.loadingService.addLoading();
    this.gameService.createGame(data)
      .subscribe({
      next: (res) => {
        if(this.handleResponseService.handleResposne(res, 'success.create-game')){
          this.userModal().openModal();
        }
      },
      error: (error) => this.handleResponseService.handleError(error, 'error.login-game', this.clearForm)
    })
  }



  createNewPlayer(event: UserModalInterface) {

    const {name, playerImg} = event

    const data: LoginGameInterface = {
      roomName:  this.createGameForm().value().roomName,
      roomPassword: this.createGameForm().value().roomPassword,
      playerName: name,
      host: true
    }

    this.loadingService.addLoading();
    this.gameService.loginGame(data)
    .subscribe({
      next: (res) => {
        if(this.handleResponseService.handleResposne(res, 'success.login-game', false)){

          this.playerService.startPlayer(res.data![0].token);

          if(playerImg !== null){
            this.createPlayerImage(res.data![0], playerImg)
          }else{
            this.loadingService.finishLoading();
            this.goGame();
          }
        }
      },
      error: (error) => this.handleResponseService.handleError(error, 'error.login-game', this.clearForm)
    });

  }

  createPlayerImage(data: any, file:File){
    this.playerService.uploadPlayerImage(data.player.id, file)
    .subscribe({
      next: (res: any) => {
        if(this.handleResponseService.handleResposne(res, 'success.uploaded-image', true, this.clearForm)){
          this.playerService.startPlayer(data.token);
          this.goGame();
        }
      },
      error: (error) => this.handleResponseService.handleError(error, 'error.warning', this.clearForm)
    });

  }

  goGame(){
    this.router.navigate(['/game']);
  }


}
