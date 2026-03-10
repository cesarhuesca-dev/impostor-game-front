import { inject, Injectable, Signal, signal } from '@angular/core';
import { ConfigurationApp } from '@/interfaces/configuration-app.interface';
import { Game, Player, WordGame } from '@/interfaces/game.interface';
import { CreateGameInterface, LoginGameInterface } from '@/interfaces/forms/game.interface';
import { LoaderService } from './loader.service';


import { gameMocked, mockConfigGame } from '../dataMocks';


@Injectable({
  providedIn: 'root'
})
export class GameService {


  private loadingService = inject(LoaderService);

  //!TODO QUITAR LOS DATA MOCKS
  private configurationGame = signal<ConfigurationApp>(mockConfigGame);
  private gameData = signal<Game>(gameMocked);

  get game() : Signal<Game> {
    return this.gameData;
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

  createGame( data : CreateGameInterface ){

    console.log('Crea game from service', data)
    this.loadingService.addLoading();
    setTimeout(() => {
      this.loadingService.finishLoading()
    }, 1000);

  }

  loginGame( data : LoginGameInterface ){

    console.log('Login game from service', data)
    this.loadingService.addLoading();
    setTimeout(() => {
      this.loadingService.finishLoading()
    }, 1000);
  }

  setNewPlayers(newPlayers : Player[]){
    this.gameData.update(game => ({
      ...game,
      players: newPlayers
    }));
  }

  //#region CONTROLES CON JUGADORES


  banPlayer(idPlayer: number) {
    //TODO AQUI HABRA QUE CONECTARLO CON BACK
    console.log('Banear al jugador con el id ', idPlayer)
  }

  //#endregion

  //#region CONTROLES DE PARTIDA
  startGame(){
    //TODO AQUI HABRA QUE CONECTARLO CON BACK
    this.gameData.update(game => ({
      ...game,
      isGameStarted: true
    }));

    console.log('Iniciando juego');
  }

  closeGame(){
    //TODO AQUI HABRA QUE CONECTARLO CON BACK
    this.gameData.update(game => ({
      ...game,
      isGameStarted: false
    }));

    console.log('Cerrando juego');
  }

  nextRound(){
    //TODO AQUI HABRA QUE CONECTARLO CON BACK

    this.gameData.update(game => ({
      ...game,
      round : game.round + 1
    }));

    console.log('Siguiente ronda', this.gameData().round);
  }
  //#endregion

  //#region Controles de ronda

  changeWordGame(newWord : WordGame){
    //TODO AQUI HABRA QUE CONECTARLO CON BACK
    this.gameData.update(game => ({
      ...game,
      word: newWord
    }));

    console.log('Cambiando palabra/categoria', this.gameData().word)
  }

  toggleShowWord(){
    //TODO AQUI HABRA QUE CONECTARLO CON BACK
    this.gameData.update(game => ({
      ...game,
      isShowingWord: !game.isShowingWord
    }));

    if(this.gameData().isShowingWord){
      console.log('Mostrando la palabra', this.gameData().isShowingWord)
    }else{
      console.log('Ocultando la palabra',this.gameData().isShowingWord)
    }
  }

  toggleShowImpostor(){
    //TODO AQUI HABRA QUE CONECTARLO CON BACK
    this.gameData.update(game => ({
      ...game,
      isShowingImpostor: !game.isShowingImpostor
    }));

    if(this.gameData().isShowingImpostor){
      console.log('Mostrando al impostor', this.gameData().isShowingImpostor)
    }else{
      console.log('Ocultando al impostor',this.gameData().isShowingImpostor)
    }
  }

  //#endregion







}





