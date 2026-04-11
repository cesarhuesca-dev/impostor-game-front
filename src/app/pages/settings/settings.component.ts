import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TranslatePipe } from '@ngx-translate/core';
import { form, FormField } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { LanguageService } from '@/services/language.service';
import { SettingsForm } from 'src/app/core/interfaces/forms/settings.interface';
import { SupportedLanguages } from 'src/app/core/enums/languages.enum';

@Component({
  selector: 'page-settings',
  imports: [TranslatePipe, ButtonModule, SelectModule, FormField],
  templateUrl: './settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SettingsComponent implements OnInit {
  private router = inject(Router);
  private languageService = inject(LanguageService);

  private readonly settingsModel = signal<SettingsForm>({
    language: this.languageService.currentLanguage,
  });

  settingsForm = form(this.settingsModel, () => {
    /* empty */
  });

  readonly supportedLanguages = computed(() => {
    const codeLng = Object.keys(this.languageService.supportedLanguages);

    return codeLng.map((lng) => ({
      name: `languages.${SupportedLanguages[lng as keyof typeof SupportedLanguages]}`,
      code: SupportedLanguages[lng as keyof typeof SupportedLanguages],
    }));
  });

  private settingsBackup = '';

  ngOnInit(): void {
    this.setBackupForm();
  }

  setBackupForm() {
    this.settingsBackup = JSON.stringify(this.settingsModel());
  }

  saveSettings() {
    if (this.settingsForm().invalid()) {
      return;
    }

    if (this.settingsForm.language().dirty()) {
      const newLng = this.settingsForm.language().value() as SupportedLanguages;
      this.changeLanguage(newLng);
    }

    this.setBackupForm();
    this.resetSettings();
  }

  resetSettings() {
    const data = JSON.parse(this.settingsBackup) as SettingsForm;
    this.settingsForm().reset({ ...data });
  }

  closeSettings() {
    // cerrar modal
    this.router.navigate(['/home']);
  }

  changeLanguage(lng: SupportedLanguages) {
    if (!lng) return;
    this.languageService.setLanguage(lng);
  }
}
