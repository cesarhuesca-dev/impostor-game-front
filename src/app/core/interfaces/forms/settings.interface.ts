import { SupportedLanguages } from '@/enums/languages.enum';
import { OverlayPosition } from '@/enums/overlay.enum';

export interface SettingsForm {
  language: SupportedLanguages;
  overlayPosition: OverlayPosition;
}
