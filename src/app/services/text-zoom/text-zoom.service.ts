import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { TextZoom } from '@capacitor/text-zoom';

import { AuthService } from '../auth/auth.service';
import { TextZoomSize } from '../../shared/enums/text-zoom-size';
import { NativePlatform } from '../../shared/enums/native-platform';

@Injectable({
  providedIn: 'root',
})
export class TextZoomService {
  private currentZoom: TextZoomSize = TextZoomSize.MEDIUM;

  constructor(
    private authService: AuthService,
    private platform: Platform,
  ) {
  }

  /**
   * Initial app text zoom
   */
  public initZoom() {
    this.authService.getThemeSettings().then(themeSettings => {
      const zoom = themeSettings?.text_size || TextZoomSize.MEDIUM;
      this.currentZoom = zoom;
      this.setZoom(zoom as TextZoomSize);
    });
  }

  /**
   * setZoom
   * @param size
   */
  public async setZoom(size: TextZoomSize) {
    this.currentZoom = size;
    this.saveTextZoomUserThemeSettings(size);

    if (this.platform.is(NativePlatform.MOBILEWEB)) {
      // PWA platform
      document.documentElement.style.setProperty('--text-zoom', size.toString());
    } else if (this.platform.is(NativePlatform.IOS) || this.platform.is(NativePlatform.ANDROID)) {
      // Native platform
      try {
        await TextZoom.set({value: size});
      } catch (err) {
        console.warn('Failed to set TextZoom on native platform', err);
      }
    }
  }

  /**
   * getCurrentZoom
   */
  public getCurrentZoom(): TextZoomSize {
    return this.currentZoom;
  }

  /**
   * Save text zoom size to user profile
   * @param size
   * @private
   */
  private saveTextZoomUserThemeSettings(size: TextZoomSize) {
    this.authService.getThemeSettings().then(themeSettings => {
      if (themeSettings) {
        themeSettings.text_size = size;
        this.authService.setThemeSettings(themeSettings);
      }
    });
  }
}
