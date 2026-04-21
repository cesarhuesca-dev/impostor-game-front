import { environment } from '@/assets/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { CookieService } from 'ngx-cookie-service';
import { LoaderService } from './loader.service';
import { Router } from '@angular/router';
import { delay } from 'rxjs';
import { HttpResponse } from '@/interfaces/response/http-response.interfaces';
import { Player } from '@/interfaces/player.interface';
import { HandleResponseService } from './utils/handle-response.service';
import { UserRoles } from '@/enums/user-roles.enum';
import { CloseGameService } from './close-game.service';

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
  private readonly router = inject(Router);
  private readonly closeGameService = inject(CloseGameService);

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

  deletePlayerData(redirect = true) {
    this.deletePlayerCookie();
    this.player.update(() => null);
    if (redirect) this.router.navigate(['/home']);
  }

  checkBanPlayer(id: string) {
    if (this.playerData?.id === id) {
      this.closeGameService.startBannedClosedGame();
      this.deletePlayerData(false);
    }
  }

  //#endregion

  startPlayer(token: string) {
    this.setPlayerCookie(token);
    this.loadPlayerData();
  }

  loadPlayerData() {
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
          this.navigateByRole();
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

  navigateByRole() {
    if (this.playerData) {
      if (this.playerData.roles.includes(UserRoles.PLAYER)) {
        this.router.navigate(['/game']);
        return;
      } else if (this.playerData.roles.includes(UserRoles.MANAGER)) {
        this.router.navigate(['/manager']);
        return;
      } else if (this.playerData.roles.includes(UserRoles.WATCHER)) {
        this.router.navigate(['/overlay']);
        return;
      }
    }
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

  playerBan(idPlayer: string) {
    return this.httpClient.delete<HttpResponse<unknown>>(`${environment.URL_API}${this.apiPlayerTopic}/${idPlayer}/ban`).pipe(delay(1000));
  }
}
