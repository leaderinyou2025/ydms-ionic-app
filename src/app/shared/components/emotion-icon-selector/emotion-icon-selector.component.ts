import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import Swiper from 'swiper';

import { IEmotionIcon } from '../../interfaces/daily-emotion-journal/daily-emotion-journal.interfaces';
import { TranslateKeys } from '../../enums/translate-keys';

@Component({
  selector: 'app-emotion-icon-selector',
  templateUrl: './emotion-icon-selector.component.html',
  styleUrls: ['./emotion-icon-selector.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, TranslateModule, FormsModule]
})
export class EmotionIconSelectorComponent implements OnInit {
  @Input() emotionIcons: IEmotionIcon[] = [];
  @Input() selectedEmotionIcon: IEmotionIcon | null = null;
  @Output() emotionSelected = new EventEmitter<IEmotionIcon>();

  currentSlideIndex = 0;
  protected readonly TranslateKeys = TranslateKeys;

  constructor() { }

  ngOnInit() {
    // Initialize swiper after view init
    setTimeout(() => {
      try {
        const swiper = new Swiper('.emotion-swiper-container', {
          slidesPerView: 1,
          spaceBetween: 10,
          centeredSlides: true,
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          on: {
            slideChange: (swiper: Swiper) => {
              this.currentSlideIndex = swiper.activeIndex;
              if (this.emotionIcons.length > 0 && this.currentSlideIndex < this.emotionIcons.length) {
                this.selectedEmotionIcon = this.emotionIcons[this.currentSlideIndex];
                this.emotionSelected.emit(this.selectedEmotionIcon);
              }
            }
          }
        });

      } catch (error) {
        console.error('ERROR initializing Swiper:', error);
      }
    }, 100);
  }
}
