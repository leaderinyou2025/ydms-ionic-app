import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { TextZoom } from '@capacitor/text-zoom';

import { LocalStorageService } from '../local-storage/local-storage.service';
import { TextZoomSize } from '../../shared/enums/text-zoom-size';
import { StorageKey } from '../../shared/enums/storage-key';

@Injectable({
  providedIn: 'root',
})
export class TextZoomService {
  private currentZoom: TextZoomSize = TextZoomSize.MEDIUM;

  constructor(
    private localStorageService: LocalStorageService,
    private platform: Platform,
  ) {
  }

  async initZoom() {
    const textSize = this.localStorageService.get<TextZoomSize>(StorageKey.TEXT_ZOOM);
    const zoom = textSize || TextZoomSize.MEDIUM;
    this.currentZoom = zoom;
    await this.setZoom(zoom as TextZoomSize);
  }

  /**
   * setZoom
   * @param size
   */
  async setZoom(size: TextZoomSize) {
    this.currentZoom = size;

    if (this.platform.is('mobileweb')) {
      document.documentElement.style.setProperty('--text-zoom', size.toString());
    } else if (this.platform.is('ios') || this.platform.is('android')) {
      try {
        await TextZoom.set({value: size});
      } catch (err) {
        console.warn('Failed to set TextZoom on native platform', err);
      }
    }

    this.localStorageService.set<number>(StorageKey.TEXT_ZOOM, size);
  }

  /**
   * getCurrentZoom
   */
  getCurrentZoom(): TextZoomSize {
    return this.currentZoom;
  }
}
