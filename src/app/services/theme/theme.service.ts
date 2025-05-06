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
        this.enableDark(false);
      } else if (theme === Theme.LIGHT) {
        this.enableLight(false);
      } else {
        this.useSystemTheme(false);
      }
    });
  }

  /**
   * Enable dark mode
   * @param isSyncServer
   */
  public enableDark(isSyncServer: boolean = true) {
    document.documentElement.classList.add(Theme.DARK);
    if (isSyncServer) this.saveUserThemeSettings(Theme.DARK);
  }

  /**
   * Enable light mode
   * @param isSyncServer
   */
  public enableLight(isSyncServer: boolean = true) {
    document.documentElement.classList.remove(Theme.DARK);
    if (isSyncServer) this.saveUserThemeSettings(Theme.LIGHT);
  }

  /**
   * Use system theme
   * @param isSyncServer
   */
  public useSystemTheme(isSyncServer: boolean = true) {
    this.prefersDark.matches ? this.enableDark() : this.enableLight();
    if (isSyncServer) this.saveUserThemeSettings(Theme.SYSTEM);
  }

  /**
   * Return theme setting
   */
  public async getTheme(): Promise<Theme> {
    const themeSettings = await this.authService.getThemeSettings();
    return themeSettings?.theme_model || Theme.SYSTEM;
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
