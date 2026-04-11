/* eslint-disable no-unused-vars */
import { SupportedLanguages } from 'src/app/core/enums/languages.enum';
import { UserRole } from 'src/app/core/enums/user-roles.enum';

export interface ConfigurationApp {
  globalSettings: GlobalSettings; // => ESTA ES LA VARIABLE QUE SE GUARDA EN LAS COOKIES
  gameConfiguration: GameConfiguration;
}

export interface User {
  role: UserRole;
}

export interface GlobalSettings {
  language: SupportedLanguages;
}

export interface GameConfiguration {
  boxPlayersPosition: BoxPlayerPosition;
}

export enum BoxPlayerPosition {
  TOP_LEFT = 'top-left',
  TOP_RIGHT = 'top-right',
  BOTTOM_LEFT = 'bottom-left',
  BOTTOM_RIGHT = 'bottom-right',
  BOTTOM_CENTER = 'bottom-center',
}
