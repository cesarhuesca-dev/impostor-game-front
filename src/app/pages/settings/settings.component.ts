import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TranslatePipe } from '@ngx-translate/core';
import { form, FormField } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { LanguageService } from '@/services/language.service';
import { SettingsForm } from 'src/app/core/interfaces/forms/settings.interface';
import { SupportedLanguages } from 'src/app/core/enums/languages.enum';
import { OverlayPosition } from '@/enums/overlay.enum';
import { SettingsService } from '@/services/settings.service';
import { Settings } from '@/interfaces/configuration-app.interface';

@Component({
  selector: 'page-settings',
  imports: [TranslatePipe, ButtonModule, SelectModule, FormField],
  templateUrl: './settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SettingsComponent implements OnInit {
  private router = inject(Router);
  private settingsService = inject(SettingsService);
  private languageService = inject(LanguageService);

  private readonly settings = computed(() => this.settingsService.getSettings());

  private readonly settingsModel = signal<SettingsForm>({
    language: this.settings()!.language,
    overlayPosition: this.settings()!.overlayPosition,
  });

  private settingsBackup = '';
  settingsForm = form(this.settingsModel);

  readonly supportedLanguages = computed(() => {
    const codeLng = Object.keys(this.languageService.suportedLanguages);

    return codeLng.map((lng) => ({
      name: `languages.${SupportedLanguages[lng as keyof typeof SupportedLanguages]}`,
      code: SupportedLanguages[lng as keyof typeof SupportedLanguages],
    }));
  });

  readonly overlayPositions = computed(() => {
    return Object.keys(OverlayPosition).map((x) => ({
      name: `overlay-positions.${OverlayPosition[x as keyof typeof OverlayPosition]}`,
      code: OverlayPosition[x as keyof typeof OverlayPosition],
    }));
  });

  ngOnInit(): void {
    this.setBackupForm();

    console.log(this.settingsModel());
    console.log(this.overlayPositions());
  }

  setBackupForm() {
    this.settingsBackup = JSON.stringify(this.settingsModel());
  }

  saveSettings() {
    if (this.settingsForm().invalid()) {
      return;
    }

    this.checkFormLanguage();
    this.checkFormOverlayPosition();

    this.setBackupForm();
    this.resetSettings();
  }

  resetSettings() {
    const data = JSON.parse(this.settingsBackup) as SettingsForm;
    this.settingsForm().reset({ ...data });
  }

  checkFormLanguage() {
    if (this.settingsForm.language().dirty()) {
      const newLng = this.settingsForm.language().value();
      this.changeLanguage(newLng);
    }
  }

  checkFormOverlayPosition() {
    if (this.settingsForm.overlayPosition().dirty()) {
      const newPosition = this.settingsForm.overlayPosition().value();
      this.changeOverlayPosition(newPosition);
    }
  }

  changeLanguage(lng: SupportedLanguages) {
    if (!lng) return;
    this.languageService.setLanguage(lng);
  }

  changeOverlayPosition(position: OverlayPosition) {
    if (!position) return;

    const settings = this.settingsService.getSettings()!;

    const newSettings: Settings = {
      ...settings,
      overlayPosition: position,
    };

    this.settingsService.setSettings(newSettings);
  }

  closeSettings() {
    this.router.navigate(['/home']);
  }
}
