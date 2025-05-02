import { Injectable } from '@angular/core';

import { LocalStorageService } from '../local-storage/local-storage.service';
import { StorageKey } from '../../shared/enums/storage-key';
import { Theme } from '../../shared/enums/theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  // Lấy thông tin theme tử hệ thống
  private prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  constructor(
    private localStorageService: LocalStorageService,
  ) {
  }

  /**
   * Load and set theme
   */
  loadTheme() {
    const theme = this.localStorageService.get<string>(StorageKey.THEME);
    if (theme === Theme.DARK) {
      this.enableDark();
    } else if (theme === Theme.LIGHT) {
      this.enableLight();
    } else {
      this.useSystemTheme();
    }
  }

  /**
   * Enable dark mode
   */
  enableDark() {
    document.documentElement.classList.add(Theme.DARK);
    this.localStorageService.set<string>(StorageKey.THEME, Theme.DARK);
  }

  /**
   * Enable light mode
   */
  enableLight() {
    document.documentElement.classList.remove(Theme.DARK);
    this.localStorageService.set<string>(StorageKey.THEME, Theme.LIGHT);
  }

  /**
   * Use system theme
   */
  useSystemTheme() {
    this.prefersDark.matches ? this.enableDark() : this.enableLight();
    this.localStorageService.remove(StorageKey.THEME);
  }

  /**
   * Return theme setting
   */
  getTheme(): Theme {
    const theme = this.localStorageService.get<Theme>(StorageKey.THEME);
    return theme || Theme.SYSTEM;
  }
}
