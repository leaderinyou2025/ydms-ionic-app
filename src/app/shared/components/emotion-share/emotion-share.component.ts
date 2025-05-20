import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { IEmotionIcon, IEmotionShareTarget, EmotionShareTargetType } from '../../interfaces/daily-emotion-journal/daily-emotion-journal.interfaces';
import { TranslateKeys } from '../../enums/translate-keys';

@Component({
  selector: 'app-emotion-share',
  templateUrl: './emotion-share.component.html',
  styleUrls: ['./emotion-share.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, TranslateModule]
})
export class EmotionShareComponent implements OnInit {
  @Input() emotionIcon: IEmotionIcon | null = null;
  @Input() availableShareTargets: IEmotionShareTarget[] = [];
  @Output() shareEmotion = new EventEmitter<{caption: string, shareTargets: IEmotionShareTarget[]}>();

  caption: string = '';
  selectedShareTargets: IEmotionShareTarget[] = [];

  protected readonly TranslateKeys = TranslateKeys;
  protected readonly EmotionShareTargetType = EmotionShareTargetType;

  constructor() { }

  ngOnInit() {
  }

  /**
   * Get share targets by type
   * @param type Share target type
   * @returns Array of share targets
   */
  getShareTargetsByType(type: EmotionShareTargetType): IEmotionShareTarget[] {
    return this.availableShareTargets.filter(target => target.type === type);
  }

  /**
   * Check if share target is selected
   * @param target Share target
   * @returns True if target is selected
   */
  isShareTargetSelected(target: IEmotionShareTarget): boolean {
    return this.selectedShareTargets.some(t => t.id === target.id && t.type === target.type);
  }

  /**
   * Toggle share target selection
   * @param target Share target
   */
  toggleShareTarget(target: IEmotionShareTarget): void {
    if (this.isShareTargetSelected(target)) {
      this.selectedShareTargets = this.selectedShareTargets.filter(
        t => !(t.id === target.id && t.type === target.type)
      );
    } else {
      this.selectedShareTargets.push(target);
    }
  }

  /**
   * Update share data when changes occur
   */
  ngDoCheck() {
    this.shareEmotion.emit({
      caption: this.caption,
      shareTargets: this.selectedShareTargets
    });
  }
}
