import { environment } from '@/assets/environments/environment.development';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private readonly apiPlayerTopic : string = '/game/player';
  private readonly httpClient = inject(HttpClient);


  private cookieService = inject(CookieService);
  private jwt = signal<string>('')

  private playerTopic = 'player'

  get jwtPlayer() {
    return this.jwt();
  }

  loadPlayerCookie(){
    const payloadUser = this.cookieService.check(this.playerTopic)
      ? this.cookieService.get(this.playerTopic)
      : null;

    if(!payloadUser){
      return;
    }

    this.setPlayerCookie(payloadUser);
  }

  setPlayerCookie( payload : string ){
    this.cookieService.set(this.playerTopic, payload);
    this.jwt.update(() => payload);
  }

  deletePlayerCookie(){
    this.cookieService.delete(this.playerTopic);
  }

  startApp(){
    this.loadPlayerCookie();
  }

  //API CALLS

  uploadPlayerImage(idPlayer : string, file: File ) {
    const formData = new FormData();
    formData.append('file', file);
    const headers = new HttpHeaders({ 'enctype': 'multipart/form-data' });
    return this.httpClient.post(`${environment.URL_API}${this.apiPlayerTopic}/image/${idPlayer}`, formData, { headers: headers });
  }


}





