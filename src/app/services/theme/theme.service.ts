import { Injectable } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { Theme } from '../../shared/enums/theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  // Lấy thông tin theme tử hệ thống
  private prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  constructor(
    private authService: AuthService
  ) {
  }

  /**
   * Load and set theme
   */
  public loadTheme() {
    this.getTheme().then(theme => {
      if (theme === Theme.DARK) {
        this.enableDark();
      } else {
        this.enableLight();
      }
    });
  }

  /**
   * Enable dark mode
   */
  public enableDark() {
    document.documentElement.classList.add(Theme.DARK);
    this.saveUserThemeSettings(Theme.DARK);
  }

  /**
   * Enable light mode
   */
  public enableLight() {
    document.documentElement.classList.remove(Theme.DARK);
    this.saveUserThemeSettings(Theme.LIGHT);
  }

  /**
   * Use system theme
   */
  public useSystemTheme() {
    this.prefersDark.matches ? this.enableDark() : this.enableLight();
    this.saveUserThemeSettings(Theme.SYSTEM);
  }

  /**
   * Return theme setting
   */
  public async getTheme(): Promise<Theme> {
    const themeSettings = await this.authService.getThemeSettings();
    return themeSettings?.theme_model || Theme.LIGHT;
  }

  /**
   * saveUserThemeSettings
   * @param theme
   * @private
   */
  private saveUserThemeSettings(theme: Theme): void {
    this.authService.getThemeSettings().then(themeSettings => {
      if (themeSettings) {
        themeSettings.theme_model = theme;
        this.authService.setThemeSettings(themeSettings);
      }
    });
  }
}
