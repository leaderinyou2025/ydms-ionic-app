import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, take } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

import { EmotionJournalCalendarComponent } from './calendar/emotion-journal-calendar.component';
import { EmotionJournalStreakComponent } from './streak-status/emotion-journal-streak.component';
import { SharedModule } from '../../../shared/shared.module';
import { AddEmotionJournalComponent } from './add-emotion-journal/add-emotion-journal.component';

import { TranslateKeys } from '../../../shared/enums/translate-keys';
import { IHeaderAnimeImage, IHeaderSegment } from '../../../shared/interfaces/header/header';
import { IDailyEmotionJournal, IEmotionIcon, IEmotionShareTarget, IEmotionStreakStatus } from '../../../shared/interfaces/daily-emotion-journal/daily-emotion-journal.interfaces';
import { DailyEmotionJournalService } from '../../../services/daily-emotion-journal/daily-emotion-journal.service';

@Component({
  selector: 'app-daily-emotion-journal',
  templateUrl: './daily-emotion-journal.page.html',
  styleUrls: ['./daily-emotion-journal.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    EmotionJournalCalendarComponent,
    EmotionJournalStreakComponent,
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DailyEmotionJournalPage implements OnInit {
  // Header configuration
  segment!: IHeaderSegment;
  animeImage!: IHeaderAnimeImage;

  // Journal entries
  journalEntries$!: Observable<IDailyEmotionJournal[]>;

  // Emotion icons
  emotionIcons$!: Observable<IEmotionIcon[]>;

  // Streak status
  streakStatus$!: Observable<IEmotionStreakStatus | null>;

  // Loading status
  isLoading$!: Observable<boolean>;

  // Selected date
  selectedDate: Date = new Date();

  // Expose TranslateKeys to template
  protected readonly TranslateKeys = TranslateKeys;

  constructor(
    private dailyEmotionJournalService: DailyEmotionJournalService,
    private toastController: ToastController,
    private translateService: TranslateService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.initHeader();
    this.loadData();
  }

  /**
   * Initialize header configuration
   */
  private initHeader(): void {
    this.segment = {
      value: 'calendar',
      buttons: [
        { value: 'calendar', label: TranslateKeys.TITLE_CALENDAR },
        { value: 'history', label: TranslateKeys.TITLE_HISTORY }
      ]
    };

    this.animeImage = {
      name: 'daily_emotion_journal',
      imageUrl: '/assets/images/daily_emotion_journal.png',
      width: '250px',
      height: 'auto',
      position: {
        position: 'absolute',
        right: '-50px',
        bottom: '10px'
      }
    };
  }

  /**
   * Load data from service
   */
  private loadData(): void {
    this.journalEntries$ = this.dailyEmotionJournalService.getJournalEntries();
    this.emotionIcons$ = this.dailyEmotionJournalService.getEmotionIcons();
    this.streakStatus$ = this.dailyEmotionJournalService.getStreakStatus();
    this.isLoading$ = this.dailyEmotionJournalService.getLoadingStatus();

    // Refresh data
    this.refreshData();
  }

  /**
   * Refresh data from service
   */
  public refreshData(): void {
    this.dailyEmotionJournalService.loadJournalEntries();
    this.dailyEmotionJournalService.loadEmotionIcons();
    this.dailyEmotionJournalService.loadStreakStatus();
  }

  /**
   * Handle refresh event
   * @param event Refresh event
   */
  public handleRefresh(event: any): void {
    this.refreshData();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  /**
   * Handle segment change
   * @param value Segment value
   */
  public segmentChanged(value: string | number): void {
    this.segment.value = value;
  }

  /**
   * Handle date selection from calendar
   * @param date Selected date
   */
  public onDateSelected(date: Date): void {
    this.selectedDate = date;
    // Store the selected date for later use
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

  /**
   * Check if a date is today
   * @param date Date to check
   * @returns True if date is today, false otherwise
   */
  private isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  /**
   * Open add emotion journal modal
   */
  public async openEmotionSelector(): Promise<void> {
    try {
      // Check if selected date is today
      if (!this.isToday(this.selectedDate)) {
        // Show message that only today's entry can be added
        const message = this.translateService.instant('DAILY_EMOTION_JOURNAL.only_today_allowed');
        this.showToast(message);
        return;
      }

      // Check if selected date already has an entry
      const entries = await this.journalEntries$.pipe(take(1)).toPromise();
      if (entries && entries.length > 0) {
        const hasEntry = entries.some(entry => {
          const entryDate = new Date(entry.date);
          return entryDate.getDate() === this.selectedDate.getDate() &&
                 entryDate.getMonth() === this.selectedDate.getMonth() &&
                 entryDate.getFullYear() === this.selectedDate.getFullYear();
        });

        if (hasEntry) {
          // Show message that date already has an entry
          const message = this.translateService.instant(TranslateKeys.DAILY_EMOTION_JOURNAL_DATE_HAS_ENTRY);
          this.showToast(message);
          return;
        }
      }

      // Navigate to add emotion journal page
      this.router.navigate(['add'], {
        relativeTo: this.route,
        state: { selectedDate: this.selectedDate }
      });
    } catch (error) {
      console.error('ERROR in openEmotionSelector:', error);
      const message = this.translateService.instant('ERROR.unknown');
      this.showToast(message);
    }
  }
}
