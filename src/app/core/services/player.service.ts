import { environment } from '@/assets/environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { CookieService } from 'ngx-cookie-service';
import { LoaderService } from './loader.service';
import { HandleResponseService } from './handle-response.service';
import { Router } from '@angular/router';
import { delay } from 'rxjs';
import { ToastMessageService } from './toast-message.service';
import { ToastPosition, ToastType } from '@/enums/toast.enum';
import { TranslateService } from '@ngx-translate/core';
import { HttpResponse } from '@/interfaces/response/http-response.interfaces';
import { Player } from '@/interfaces/player.interface';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private readonly apiPlayerTopic: string = '/game/player';
  private readonly playerCookieTopic: string = 'player';

  private readonly httpClient = inject(HttpClient);
  private readonly cookieService = inject(CookieService);
  private readonly loaderService = inject(LoaderService);
  private readonly handleResponseService = inject(HandleResponseService);
  private readonly toastMessageService = inject(ToastMessageService);
  private readonly translateService = inject(TranslateService);
  private readonly router = inject(Router);

  private readonly jwt = signal<string>('');
  private readonly player = signal<Player | null>(null);

  get jwtPlayer() {
    return this.jwt();
  }

  get playerData() {
    return this.player();
  }

  get isLogged() {
    return this.player() ? true : false;
  }

  //#region GESTION DE COOKIE DEL PLAYER
  loadPlayerCookie() {
    const payloadUser = this.cookieService.check(this.playerCookieTopic) ? this.cookieService.get(this.playerCookieTopic) : null;

    if (!payloadUser) {
      return;
    }

    this.setPlayerCookie(payloadUser);
  }

  setPlayerCookie(payload: string) {
    this.cookieService.set(this.playerCookieTopic, payload);
    this.jwt.update(() => payload);
  }

  deletePlayerCookie() {
    this.cookieService.delete(this.playerCookieTopic);
  }
  //#endregion

  //#region GESTION INFORMACION DEL PLAYER

  setPlayerData(newData: Player) {
    this.player.update(() => ({ ...newData }));
  }

  deletePlayerData() {
    this.deletePlayerCookie();
    this.player.update(() => null);
    this.router.navigate(['/home']);
  }

  checkBanPlayer(id: string) {
    if (this.playerData?.id === id) {
      this.deletePlayerData();
      this.toastMessageService.addMessage({
        key: ToastPosition.TOP_RIGHT,
        severity: ToastType.ERROR,
        summary: this.translateService.instant('common.banned'),
      });
    }
  }

  closeGame() {
    this.deletePlayerData();
    this.toastMessageService.addMessage({
      key: ToastPosition.TOP_RIGHT,
      severity: ToastType.INFO,
      summary: this.translateService.instant('common.closed-game'),
    });
  }

  //#endregion

  startPlayer(token: string) {
    this.setPlayerCookie(token);
    this.loadPlayer();
  }

  loadPlayer() {
    this.loaderService.addLoading();
    this.loadPlayerCookie();

    if (!this.jwt() || this.jwt().length === 0) {
      this.deletePlayerData();
      this.loaderService.finishLoading();
      return;
    }

    this.getPlayerByToken().subscribe({
      next: (res) => {
        if (this.handleResponseService.handleResponse(res)) {
          this.setPlayerData(res.data![0]);
          this.router.navigate(['/game']);
        } else {
          this.deletePlayerData();
        }
      },
      error: (error) => {
        this.handleResponseService.handleError(error, 'error.warning');
        this.deletePlayerData();
      },
    });
  }

  //API CALLS

  private getPlayerByToken() {
    return this.httpClient.get<HttpResponse<Player>>(`${environment.URL_API}${this.apiPlayerTopic}/token`).pipe(delay(1000));
  }

  getPlayer(id: string) {
    return this.httpClient.get<HttpResponse<Player>>(`${environment.URL_API}${this.apiPlayerTopic}/${id}`);
  }

  uploadPlayerImage(idPlayer: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });
    return this.httpClient.post<HttpResponse<unknown>>(`${environment.URL_API}${this.apiPlayerTopic}/image/${idPlayer}`, formData, {
      headers: headers,
    });
  }

  playerExit(idPlayer: string) {
    return this.httpClient.delete<HttpResponse<unknown>>(`${environment.URL_API}${this.apiPlayerTopic}/${idPlayer}`).pipe(delay(1000));
  }
}
