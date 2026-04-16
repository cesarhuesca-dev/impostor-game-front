import { inject, Injectable, signal } from '@angular/core';
import { Game } from 'src/app/core/interfaces/game.interface';
import { CreateGameInterface, LoginGameInterface } from 'src/app/core/interfaces/forms/game.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/assets/environments/environment.development';
import { HttpResponse } from '@/interfaces/response/http-response.interfaces';
import { delay } from 'rxjs';
import { Join } from '@/interfaces/join.interface';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly apiGameTopic: string = '/game';

  private readonly httpClient = inject(HttpClient);

  private readonly game = signal<Game | null>(null);

  get gameData() {
    return this.game();
  }

  setGameData(newData: Game) {
    this.game.update(() => ({ ...newData }));
  }

  deleteGameData() {
    this.game.update(() => null);
  }

  getGame(idGame: string) {
    return this.httpClient.get<HttpResponse<Game>>(`${environment.URL_API}${this.apiGameTopic}/${idGame}`).pipe(delay(1000));
  }

  createGame(data: CreateGameInterface) {
    return this.httpClient.post<HttpResponse<Game>>(`${environment.URL_API}${this.apiGameTopic}`, data).pipe(delay(1000));
  }

  loginVerifyGame(data: LoginGameInterface) {
    return this.httpClient.post<HttpResponse<unknown>>(`${environment.URL_API}${this.apiGameTopic}/join/verify`, data).pipe(delay(1000));
  }

  loginGame(data: LoginGameInterface) {
    return this.httpClient.post<HttpResponse<Join>>(`${environment.URL_API}${this.apiGameTopic}/join`, data).pipe(delay(1000));
  }

  loginWatcher(data: LoginGameInterface) {
    return this.httpClient.post<HttpResponse<Join>>(`${environment.URL_API}${this.apiGameTopic}/join/watcher`, data).pipe(delay(1000));
  }

  //#region CONTROLES DE PARTIDA
  startGame() {
    return this.httpClient.post<HttpResponse<Game>>(`${environment.URL_API}${this.apiGameTopic}/start`, {}).pipe(delay(1000));
  }

  endGame() {
    return this.httpClient.post<HttpResponse<Game>>(`${environment.URL_API}${this.apiGameTopic}/end`, {}).pipe(delay(1000));
  }

  closeGame(idGame: string) {
    return this.httpClient.delete<HttpResponse<unknown>>(`${environment.URL_API}${this.apiGameTopic}/${idGame}`, {}).pipe(delay(1000));
  }

  nextRound(newWord: string | null = null) {
    return this.httpClient.post<HttpResponse<Game>>(`${environment.URL_API}${this.apiGameTopic}/round`, { word: newWord }).pipe(delay(1000));
  }
  //#endregion

  //#region Controles de ronda

  changeWordGame(newWord: string | null = null) {
    return this.httpClient.post<HttpResponse<Game>>(`${environment.URL_API}${this.apiGameTopic}/word`, { word: newWord }).pipe(delay(1000));
  }

  changeCategoryGame(idGame: string, category: string) {
    return this.httpClient.patch<HttpResponse<Game>>(`${environment.URL_API}${this.apiGameTopic}/${idGame}/category`, { category }).pipe(delay(1000));
  }

  //#endregion
}
