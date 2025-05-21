import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, Platform, ToastController } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { SharedModule } from '../../../../shared/shared.module';
import { IEmotionIcon, IEmotionShareTarget, EmotionShareTargetType } from '../../../../shared/interfaces/daily-emotion-journal/daily-emotion-journal.interfaces';
import { TranslateKeys } from '../../../../shared/enums/translate-keys';
import { DailyEmotionJournalService } from '../../../../services/daily-emotion-journal/daily-emotion-journal.service';
import { EmotionIconSelectorComponent } from '../../../../shared/components/emotion-icon-selector/emotion-icon-selector.component';
import { EmotionShareComponent } from '../../../../shared/components/emotion-share/emotion-share.component';

@Component({
  selector: 'app-add-emotion-journal',
  templateUrl: './add-emotion-journal.component.html',
  styleUrls: ['./add-emotion-journal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, TranslateModule, FormsModule, SharedModule, EmotionIconSelectorComponent, EmotionShareComponent]
})
export class AddEmotionJournalComponent implements OnInit {
  emotionIcons: IEmotionIcon[] = [];
  selectedDate: Date = new Date();
  selectedEmotionIcon: IEmotionIcon | null = null;
  caption: string = '';
  availableShareTargets: IEmotionShareTarget[] = [];
  selectedShareTargets: IEmotionShareTarget[] = [];
  protected readonly TranslateKeys = TranslateKeys;

  constructor(
    private dailyEmotionJournalService: DailyEmotionJournalService,
    private translateService: TranslateService,
    private platform: Platform,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private toastController: ToastController
  ) {
    // Handle hardware back button
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.cancel();
    });

    // Get selected date from router state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.selectedDate = navigation.extras.state['selectedDate'] || new Date();
    }
  }

  async ngOnInit() {
    try {
      // Load emotion icons
      this.emotionIcons = await this.dailyEmotionJournalService.getEmotionIconsArray();

      // Set default selected emotion icon
      if (this.emotionIcons.length > 0) {
        this.selectedEmotionIcon = this.emotionIcons[0];
      }

      // Load available share targets
      await this.loadShareTargets();
    } catch (error) {
      console.error('ERROR in ngOnInit:', error);
    }
  }

  /**
   * Handle emotion selection from the emotion-icon-selector component
   * @param emotion Selected emotion icon
   */
  onEmotionSelected(emotion: IEmotionIcon): void {
    this.selectedEmotionIcon = emotion;

  }

  /**
   * Handle share emotion event from the emotion-share component
   * @param data Share data containing caption and share targets
   */
  onShareEmotion(data: {caption: string, shareTargets: IEmotionShareTarget[]}): void {
    this.caption = data.caption;
    this.selectedShareTargets = data.shareTargets;

  }

  /**
   * Load available share targets
   */
  private async loadShareTargets(): Promise<void> {
    try {
      this.availableShareTargets = await this.dailyEmotionJournalService.getAvailableShareTargets();

    } catch (error) {
      console.error('ERROR loading share targets:', error);
      this.availableShareTargets = [];
    }
  }

  /**
   * Cancel and go back
   */
  cancel(): void {
    this.location.back();
  }

  /**
   * Handle ESC key press
   */
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.cancel();
  }

  /**
   * Save emotion journal entry
   */
  async save(): Promise<void> {
    try {
      if (this.selectedEmotionIcon) {


        // Create journal entry
        const success = await this.dailyEmotionJournalService.createJournalEntry(
          this.selectedEmotionIcon.id,
          this.caption,
          this.selectedShareTargets,
          this.selectedDate
        );

        if (success) {
          const message = this.translateService.instant(TranslateKeys.DAILY_EMOTION_JOURNAL_ENTRY_CREATED);
          this.showToast(message);
          // Navigate back to daily-emotion-journal page
          this.router.navigate(['/daily-emotion-journal']);
          // Refresh data on the parent page
          this.dailyEmotionJournalService.loadJournalEntries();
          this.dailyEmotionJournalService.loadStreakStatus();
        } else {
          const message = this.translateService.instant(TranslateKeys.DAILY_EMOTION_JOURNAL_ENTRY_CREATION_FAILED);
          this.showToast(message);
        }
      } else {
        console.error('ERROR: No emotion selected');
      }
    } catch (error) {
      console.error('ERROR in save:', error);
      const message = this.translateService.instant('ERROR.unknown');
      this.showToast(message);
    }
  }

  /**
   * Show toast message
   * @param message Message to show
   */
  private async showToast(message: string): Promise<void> {
    try {
      const toast = await this.toastController.create({
        message,
        duration: 2000,
        position: 'top',
        cssClass: 'font-comic-sans'
      });
      await toast.present();
    } catch (error) {
      console.error('ERROR showing toast:', error);
    }
  }
}
