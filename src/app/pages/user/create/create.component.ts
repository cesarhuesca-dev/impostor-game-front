import { ChangeDetectionStrategy, Component, HostListener, inject, OnInit, signal, viewChild } from '@angular/core';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { form, FormField, required, min, minLength, validate, pattern } from '@angular/forms/signals';
import { ButtonModule } from 'primeng/button';
import { CreateGameInterface, LoginGameInterface } from 'src/app/core/interfaces/forms/game.interface';
import { GameService } from '@/services/game.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { UserModal } from '@/shared/components/user-modal/user-modal.component';
import { LoaderService } from '@/services/loader.service';
import { PlayerService } from '@/services/player.service';
import { UserModalInterface } from 'src/app/core/interfaces/forms/user-modal.interface';
import { AuxiliarService } from '@/services/auxiliar.service';
import { ItemListInterface } from '@/interfaces/utilities/list.interface';
import { Join } from '@/interfaces/join.interface';
import { Game } from '@/interfaces/game.interface';
import { HandleResponseService } from '@/services/utils/handle-response.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-create',
  imports: [ToggleSwitchModule, FormField, ButtonModule, TranslatePipe, UserModal],
  templateUrl: './create.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CreateComponent implements OnInit {
  private readonly userModal = viewChild.required(UserModal);

  private readonly gameService = inject(GameService);
  private readonly loadingService = inject(LoaderService);
  private readonly handleResponseService = inject(HandleResponseService);
  private readonly playerService = inject(PlayerService);
  private readonly auxiliarService = inject(AuxiliarService);
  private readonly translateService = inject(TranslateService);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  private readonly defaultDataForm = {
    roomName: '',
    roomPassword: '',
    roomPlayers: 4,
    customWords: false,
    specificCategory: false,
    category: '',
    multipleImpostors: false,
    overlay: false,
  };

  readonly createGameModel = signal<CreateGameInterface>({ ...this.defaultDataForm });

  createGameForm = form(this.createGameModel, (schemaPath) => {
    required(schemaPath.roomName, { message: 'forms.error.room-name-required' });
    minLength(schemaPath.roomName, 3, { message: 'forms.error.room-name-min-length' });

    required(schemaPath.roomPassword, { message: 'forms.error.room-password-required' });
    minLength(schemaPath.roomPassword, 5, { message: 'forms.error.room-password-min-length' });
    pattern(schemaPath.roomPassword, /^[A-Za-z0-9]{5,}$/, { message: 'forms.error.room-password-pattern' });

    required(schemaPath.roomPlayers, { message: 'room-players-required' });
    min(schemaPath.roomPlayers, 4, { message: 'forms.error.room-players-min' });

    validate(schemaPath.specificCategory, ({ valueOf }) => {
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

  readonly gameCategories = signal<ItemListInterface[]>([]);

  readonly game = signal<Game | null>(null);

  constructor() {
    this.translateService.get('title').subscribe((res) => {
      this.title.setTitle(res['create-page']);
      this.meta.updateTag({ property: 'og:title', content: res['create-page'] });
      this.meta.updateTag({ name: 'description', content: res['create-page-description'] });
      this.meta.updateTag({ property: 'og:description', content: res['create-page-description'] });
    });
  }

  ngOnInit(): void {
    this.setGameCategories();
  }

  clearForm = () => {
    this.createGameModel.update(() => ({ ...this.defaultDataForm }));
  };

  setGameCategories() {
    this.loadingService.addLoading();
    this.auxiliarService.getCategories().subscribe((categories) => {
      this.gameCategories.update(() => categories);
      this.loadingService.finishLoading();
    });
  }

  categoryToggle() {
    if (!this.createGameForm.specificCategory().value()) {
      this.createGameModel.update((x) => ({
        ...x,
        category: '',
      }));
    }
  }

  createGame() {
    if (!this.createGameForm().valid()) {
      return;
    }

    const data = this.createGameForm().value();

    this.loadingService.addLoading();
    this.gameService.createGame(data).subscribe({
      next: (res) => {
        if (this.handleResponseService.handleResponse(res, 'success.create-game')) {
          this.game.update(() => res.data![0]);
          this.userModal().openModal();
        }
      },
      error: (error) => this.handleResponseService.handleError(error, 'error.create-game', this.clearForm),
    });
  }

  createNoPlayer() {
    const data: LoginGameInterface = {
      roomName: this.createGameForm().value().roomName,
      roomPassword: this.createGameForm().value().roomPassword,
      host: true,
    };

    this.loadingService.addLoading();
    this.gameService.loginWatcher(data).subscribe({
      next: (res) => {
        if (this.handleResponseService.handleResponse(res, 'success.login-game', false)) {
          const player = res.data![0];
          this.playerService.startPlayer(player.token);
          this.playerService.navigateByRole();
          this.loadingService.finishLoading();
        }
      },
      error: (error) => this.handleResponseService.handleError(error, 'error.login-game', this.clearForm),
    });
  }

  createNewPlayer(event: UserModalInterface) {
    const { name, playerImg } = event;

    const data: LoginGameInterface = {
      roomName: this.createGameForm().value().roomName,
      roomPassword: this.createGameForm().value().roomPassword,
      playerName: name,
      host: true,
    };

    this.loadingService.addLoading();
    this.gameService.loginGame(data).subscribe({
      next: (res) => {
        if (this.handleResponseService.handleResponse(res, 'success.login-game', false)) {
          const player = res.data![0];

          this.playerService.startPlayer(player.token);

          if (playerImg !== null) {
            this.createPlayerImage(player, playerImg);
          } else {
            this.loadingService.finishLoading();
            this.playerService.navigateByRole();
          }
        }
      },
      error: (error) => this.handleResponseService.handleError(error, 'error.login-game', this.clearForm),
    });
  }

  createPlayerImage(data: Join, file: File) {
    this.playerService.uploadPlayerImage(data.player.id, file).subscribe({
      next: (res) => {
        if (this.handleResponseService.handleResponse(res, '', true, this.clearForm)) {
          this.playerService.startPlayer(data.token);
          this.playerService.navigateByRole();
        }
      },
      error: (error) => this.handleResponseService.handleError(error, 'error.warning', this.clearForm),
    });
  }

  playerCanceled() {
    this.clearForm();

    if (!this.game()) {
      return;
    }

    this.loadingService.addLoading();
    this.gameService.closeGame(this.game()!.id).subscribe({
      next: (res) => this.handleResponseService.handleResponse(res, 'success.delete-game', true, this.clearForm),
      error: (error) => this.handleResponseService.handleError(error, 'error.warning', this.clearForm),
    });
  }

  @HostListener('window:beforeunload') handleBeforeUnload() {
    this.playerCanceled();
  }
}
