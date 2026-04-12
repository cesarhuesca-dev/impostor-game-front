import { OverlayPosition } from '@/enums/overlay.enum';
import { SupportedLanguages } from 'src/app/core/enums/languages.enum';

export interface Settings {
  language: SupportedLanguages;
  overlayPosition: OverlayPosition;
}
