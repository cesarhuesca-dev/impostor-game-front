import { SupportedLanguages } from "./enums/languages.enum"
import { UserRole } from "./enums/user-roles.enum"
import { BoxPlayerPosition, ConfigurationApp } from "./interfaces/configuration-app.interface"
import { Player, WordGame, Game } from "./interfaces/game.interface"

export const mockConfigGame: ConfigurationApp = {
  user: {
    role: UserRole.ADMIN
  },
  globalSettings: {
    language: SupportedLanguages.ES
  },
  gameConfiguration: {
    players: 5,
    boxPlayersPosition: BoxPlayerPosition.BOTTOM_LEFT
  }
}

export const mockedPlayers: Player[] = [
  {
    name: 'Cesar',
    img: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png',
    impostor: false,
    id: 1
  },
  {
    name: 'Mario',
    img: 'https://primefaces.org/cdn/primeng/images/demo/avatar/asiyajavayant.png',
    impostor: true,
    id: 2
  },
  {
    name: 'Fran',
    img: '',
    impostor: false,
    id: 3
  },
  {
    name: 'Ibai',
    img: 'https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp',
    impostor: false,
    id: 4
  },
  {
    name: 'Xokas',
    img: 'https://primefaces.org/cdn/primeng/images/demo/avatar/walter.jpg',
    impostor: false,
    id: 5
  }
]

export const mockWord : WordGame = { category : 'Redes Sociales', word: 'Ibai' }


export const gameMocked : Game = {

  players: mockedPlayers,
  word: mockWord,
  round: 0,
  isShowingWord: false,
  isShowingImpostor: false,
  isGameStarted: false
}
