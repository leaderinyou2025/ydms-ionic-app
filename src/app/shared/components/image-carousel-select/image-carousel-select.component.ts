import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Swiper from 'swiper';

import { TranslateKeys } from '../../enums/translate-keys';
import { IonicColors } from '../../enums/ionic-colors';
import { IAssetsResource } from '../../interfaces/settings/assets-resource';

@Component({
  selector: 'app-image-carousel-select',
  templateUrl: './image-carousel-select.component.html',
  styleUrls: ['./image-carousel-select.component.scss'],
  standalone: false,
})
export class ImageCarouselSelectComponent implements OnInit {

  @Input() wallpapers: IAssetsResource[] = [];
  @Input() selectedValue!: number | undefined;
  @Output() selectedWallpaper = new EventEmitter<IAssetsResource>();

  constructor() {
  }

  ngOnInit() {
    if (this.wallpapers?.length) {
      setTimeout(() => {
        new Swiper('.swiper-container', {
          slidesPerView: 1.5,
          spaceBetween: 10,
          centeredSlides: true,
          pagination: {dynamicBullets: true, el: '.swiper-pagination', clickable: true, enabled: true}
        });
      }, 0);
    }
  }

  /**
   * selectWallpaper
   * @param wallpaper
   */
  public selectWallpaper(wallpaper: IAssetsResource): void {
    if (this.selectedValue === wallpaper.id) return;
    this.selectedWallpaper.emit(wallpaper)
  }

  protected readonly TranslateKeys = TranslateKeys;
  protected readonly IonicColors = IonicColors;
}
