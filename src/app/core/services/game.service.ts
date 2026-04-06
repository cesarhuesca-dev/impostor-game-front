import { inject, Injectable, Signal, signal } from '@angular/core';
import { ConfigurationApp } from 'src/app/core/interfaces/configuration-app.interface';
import { Game, Player, WordGame } from 'src/app/core/interfaces/game.interface';
import { CreateGameInterface, LoginGameInterface } from 'src/app/core/interfaces/forms/game.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/assets/environments/environment.development';
import { HttpResponse } from 'src/app/core/interfaces/http-response.interfaces';
import { delay } from 'rxjs';
import { LoaderService } from './loader.service';
import { HandleResponseService } from './handle-response.service';
import { mockConfigGame } from 'src/app/dataMocks';


@Injectable({
  providedIn: 'root'
})
export class GameService {

  private readonly apiGameTopic : string = '/game';

  private readonly httpClient = inject(HttpClient);
  private readonly loaderService = inject(LoaderService);
  private readonly handleResponseService = inject(HandleResponseService);


  //!TODO QUITAR LOS DATA MOCKS
  private configurationGame = signal<ConfigurationApp>(mockConfigGame);
  private game = signal<Game | null >(null);

  get gameData() {
    return this.game();
  }

  get configuration() : Signal<ConfigurationApp> {
    return this.configurationGame;
  }

  setNewconfigurationApp(configuration : ConfigurationApp){

    this.configurationGame.update(oldConfig => ({
      ...oldConfig,
      ...configuration
    }));
  }

  setGameData(newData : Game){
    this.game.update(() => ({...newData}));
  }

  deleteGameData(){
    this.game.update(() => (null));
  }


  getGame(idGame : string){
    return this.httpClient.get<HttpResponse<any>>(`${environment.URL_API}${this.apiGameTopic}/${idGame}` )
      .pipe(delay(1000))
  }

  createGame( data : CreateGameInterface ){
    return this.httpClient.post<HttpResponse<any>>(`${environment.URL_API}${this.apiGameTopic}`, data )
      .pipe(delay(1000))
  }

  loginVerifyGame( data : LoginGameInterface ) {
    return this.httpClient.post<HttpResponse<any>>(`${environment.URL_API}${this.apiGameTopic}/join/verify`, data )
      .pipe(delay(1000))
  }

  loginGame( data : LoginGameInterface ) {
    return this.httpClient.post<HttpResponse<any>>(`${environment.URL_API}${this.apiGameTopic}/join`, data )
      .pipe(delay(1000))
  }

  setNewPlayers(newPlayers : Player[]){
    // this.game.update(game => ({
    //   ...game,
    //   players: newPlayers
    // }));
  }

  //#region CONTROLES CON JUGADORES


  banPlayer(idPlayer: string) {
    //TODO AQUI HABRA QUE CONECTARLO CON BACK
    console.log('Banear al jugador con el id ', idPlayer)
  }

  //#endregion

  //#region CONTROLES DE PARTIDA
  startGame(){
    return this.httpClient.post<HttpResponse<any>>(`${environment.URL_API}${this.apiGameTopic}/start`, {})
      .pipe(delay(1000))
  }

  endGame(){
    return this.httpClient.post<HttpResponse<any>>(`${environment.URL_API}${this.apiGameTopic}/end`, {})
      .pipe(delay(1000))
  }

  closeGame(idGame: string){
    return this.httpClient.delete<HttpResponse<any>>(`${environment.URL_API}${this.apiGameTopic}/${idGame}`, {})
      .pipe(delay(1000))
  }

  nextRound(){
    return this.httpClient.post<HttpResponse<any>>(`${environment.URL_API}${this.apiGameTopic}/round`, {})
      .pipe(delay(1000))
  }
  //#endregion

  //#region Controles de ronda

  changeWordGame(newWord : WordGame){
    //TODO AQUI HABRA QUE CONECTARLO CON BACK
    // this.game.update(game => ({
    //   ...game,
    //   word: newWord
    // }));

    console.log('Cambiando palabra/categoria', this.game()!.word)
  }

  toggleShowWord(){
    //TODO AQUI HABRA QUE CONECTARLO CON BACK
    // this.gameData.update(game => ({
    //   ...game,
    //   isShowingWord: !game.isShowingWord
    // }));

    // if(this.gameData().isShowingWord){
    //   console.log('Mostrando la palabra', this.gameData().isShowingWord)
    // }else{
    //   console.log('Ocultando la palabra',this.gameData().isShowingWord)
    // }
  }

  toggleShowImpostor(){
    //TODO AQUI HABRA QUE CONECTARLO CON BACK
    // this.gameData.update(game => ({
    //   ...game,
    //   isShowingImpostor: !game.isShowingImpostor
    // }));

    // if(this.gameData().isShowingImpostor){
    //   console.log('Mostrando al impostor', this.gameData().isShowingImpostor)
    // }else{
    //   console.log('Ocultando al impostor',this.gameData().isShowingImpostor)
    // }
  }

  //#endregion







}





