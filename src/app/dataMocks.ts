import { SupportedLanguages } from "./core/enums/languages.enum"
import { UserRole } from "./core/enums/user-roles.enum"
import { BoxPlayerPosition, ConfigurationApp } from "./core/interfaces/configuration-app.interface"
import { Player, WordGame, Game } from "./core/interfaces/game.interface"

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
    impostor: true,
    id: '1',
    avatarImg: false,
    game: {
      id: "",
      roomName: "",
      roomPlayers: 0,
      customWords: false,
      specificCategory: false,
      category: "",
      multipleImpostors: false,
      overlay: false,
      word: {
        word: ""
      },
      players: [],
      round: 0,
      showingWord: false,
      showingImpostor: false,
      gameStarted: false,
      roomPlayersJoined: 0
    },
    host: false
  },
  {
    name: 'Mario',
    img: 'https://primefaces.org/cdn/primeng/images/demo/avatar/asiyajavayant.png',
    impostor: true,
    id: '2',
    avatarImg: false,
    game: {
      id: "",
      roomName: "",
      roomPlayers: 0,
      customWords: false,
      specificCategory: false,
      category: "",
      multipleImpostors: false,
      overlay: false,
      word: {
        word: ""
      },
      players: [],
      round: 0,
      showingWord: false,
      showingImpostor: false,
      gameStarted: false,
      roomPlayersJoined: 0
    },
    host: false
  },
  {
    name: 'Fran',
    img: '',
    impostor: false,
    id: '3',
    avatarImg: false,
    game: {
      id: "",
      roomName: "",
      roomPlayers: 0,
      customWords: false,
      specificCategory: false,
      category: "",
      multipleImpostors: false,
      overlay: false,
      word: {
        word: ""
      },
      players: [],
      round: 0,
      showingWord: false,
      showingImpostor: false,
      gameStarted: false,
      roomPlayersJoined: 0
    },
    host: false
  },
  {
    name: 'Ibai',
    img: 'https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp',
    impostor: false,
    id: '4',
    avatarImg: false,
    game: {
      id: "",
      roomName: "",
      roomPlayers: 0,
      customWords: false,
      specificCategory: false,
      category: "",
      multipleImpostors: false,
      overlay: false,
      word: {
        word: ""
      },
      players: [],
      round: 0,
      showingWord: false,
      showingImpostor: false,
      gameStarted: false,
      roomPlayersJoined: 0
    },
    host: false
  },
  {
    name: 'Xokas',
    img: 'https://primefaces.org/cdn/primeng/images/demo/avatar/walter.jpg',
    impostor: false,
    id: '5',
    avatarImg: false,
    game: {
      id: "",
      roomName: "",
      roomPlayers: 0,
      customWords: false,
      specificCategory: false,
      category: "",
      multipleImpostors: false,
      overlay: false,
      word: {
        word: ""
      },
      players: [],
      round: 0,
      showingWord: false,
      showingImpostor: false,
      gameStarted: false,
      roomPlayersJoined: 0
    },
    host: false
  }
]

export const mockWord : WordGame = { category : 'Redes Sociales', word: 'Ibai' }


export const gameMocked : Game = {
  players: mockedPlayers,
  word: mockWord,
  round: 0,
  showingWord: false,
  showingImpostor: false,
  gameStarted: false,

  id: "",
  roomName: "",
  roomPlayers: 0,
  customWords: false,
  specificCategory: false,
  category: "",
  multipleImpostors: false,
  overlay: false,
  roomPlayersJoined: 0
}
