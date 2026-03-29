import { inject, Injectable } from '@angular/core';

import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class PlayerService {


  private cookieService = inject(CookieService);

  private playerTopic = 'player'

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
  }

  deletePlayerCookie(){
    this.cookieService.delete(this.playerTopic);
  }

}





