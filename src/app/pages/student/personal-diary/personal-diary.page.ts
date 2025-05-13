import {Component, OnInit, HostListener} from '@angular/core';
import {Observable} from 'rxjs';
import {AlertController, ModalController, SegmentValue} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';

import {PersonalDiaryService} from '../../../services/personal-diary/personal-diary.service';
import {AuthService} from '../../../services/auth/auth.service';
import {EmotionFilterType, EmotionType} from '../../../shared/enums/personal-diary/personal-diary.enum';
import {
  IPersonalDiaryEntry,
} from '../../../shared/interfaces/personal-diary/personal-diary.interfaces';
import {IAuthData} from '../../../shared/interfaces/auth/auth-data';
import {TranslateKeys} from '../../../shared/enums/translate-keys';
import {getEmotionEmoji} from '../../../shared/data/emotion-options.data';
import {REACTION_OPTIONS} from "../../../shared/data/reaction-options.data";
import {IHeaderAnimeImage, IHeaderSegment} from "../../../shared/interfaces/header/header";

@Component({
  selector: 'app-personal-diary',
  templateUrl: './personal-diary.page.html',
  styleUrls: ['./personal-diary.page.scss'],
  standalone: false,
})
export class PersonalDiaryPage implements OnInit {
  // Expose enum to template
  protected readonly EmotionFilterType = EmotionFilterType;

  // Current filter type
  currentFilter: EmotionFilterType = EmotionFilterType.MY_ENTRIES;
  segment!: IHeaderSegment;
  animeImage!: IHeaderAnimeImage;

  // Diary entries
  diaryEntries$!: Observable<IPersonalDiaryEntry[]>;

  // Current user
  currentUser: IAuthData | undefined;

  // Selected entry for suggestions
  selectedEntry: IPersonalDiaryEntry | null = null;

  // Show suggestions popup
  showSuggestions: boolean = false;

  // Suggestions for selected emotion
  emotionSuggestions: string[] = [];

  // Position for suggestions popup
  suggestionPosition: { top: number, left: number } = {top: 0, left: 0};

  // Selected entry for reactions
  reactionEntry: IPersonalDiaryEntry | null = null;

  // Show reactions popup
  showReactions: boolean = false;

  // Selected entry for reaction stats
  statsEntry: IPersonalDiaryEntry | null = null;

  // Translation keys
  protected readonly TranslateKeys = TranslateKeys;

  // Available reactions
  reactions = REACTION_OPTIONS;

  constructor(
    private emotionDiaryService: PersonalDiaryService,
    private authService: AuthService,
    private alertController: AlertController,
    private modalController: ModalController,
    private translate: TranslateService
  ) {
  }

  ngOnInit() {
    this.initHeader();
    this.loadCurrentUser();
    this.loadDiaryEntries();
  }

  /**
   * Load current user
   */
  private async loadCurrentUser(): Promise<void> {
    this.currentUser = await this.authService.getAuthData();
  }

  /**
   * Load diary entries based on current filter
   */
  private loadDiaryEntries(): void {
    this.diaryEntries$ = this.emotionDiaryService.getDiaryEntries(this.currentFilter);
  }

  /**
   * Handle segment change event
   * @param event Segment change event
   */
  public segmentChanged(filter: SegmentValue | undefined): void {
    if (filter === EmotionFilterType.MY_ENTRIES || filter === EmotionFilterType.SHARED_ENTRIES) {
      if (this.currentFilter === filter) return;
      this.currentFilter = filter;
      this.loadDiaryEntries();
      this.closeSuggestions();
    }
  }

  /**
   * Toggle reactions popup
   * @param entry Entry to react to
   * @param event Click event
   */
  public toggleReactions(entry: IPersonalDiaryEntry, event: Event): void {
    event.stopPropagation(); // Prevent event bubbling

    if (this.showReactions && this.reactionEntry?.id === entry.id) {
      this.closeReactions();
    } else {
      this.closeReactions();
      this.closeSuggestions();
      this.reactionEntry = entry;
      this.showReactions = true;
    }
  }

  /**
   * Close reactions popup
   */
  public closeReactions(): void {
    this.showReactions = false;
    this.reactionEntry = null;
  }

  /**
   * Add reaction to an entry
   * @param entryId Entry ID
   * @param reactionType Reaction type
   * @param event Click event
   */
  public async addReaction(entryId: number, reactionType: string, event: Event): Promise<void> {
    event.stopPropagation(); // Prevent event bubbling

    // Call the service method to add the reaction
    const success = await this.emotionDiaryService.addReaction(entryId, reactionType);

    if (!success) {
      console.error(`Failed to add reaction ${reactionType} to entry ${entryId}`);
      // Could show a toast or alert here to inform the user
    }

    // Close the reactions popup
    this.closeReactions();
  }

  /**
   * Get reactions for an entry
   * @param entryId Entry ID
   * @returns Reactions object
   */
  public getReactions(entryId: number): any {
    return this.emotionDiaryService.getReactions(entryId);
  }

  /**
   * Check if current user has reacted to an entry
   * @param entryId Entry ID
   * @returns User's reaction type or null if not reacted
   */
  public getUserReaction(entryId: number): string | null {
    return this.emotionDiaryService.getUserReaction(entryId);
  }

  /**
   * Get total reactions count for an entry
   * @param entryId Entry ID
   * @returns Total reactions count
   */
  public getTotalReactionsCount(entryId: number): number {
    return this.emotionDiaryService.getTotalReactionsCount(entryId);
  }

  /**
   * Show reaction statistics modal
   * @param entry Entry to show statistics for
   * @param event Click event
   */
  public async showReactionStats(entry: IPersonalDiaryEntry, event: Event): Promise<void> {
    event.stopPropagation(); // Prevent event bubbling
    this.statsEntry = entry;

    const reactions = this.getReactions(entry.id);
    if (!reactions) return;

    const alert = await this.alertController.create({
      header: this.translate.instant(TranslateKeys.PERSONAL_DIARY_REACTION_STATS),
      cssClass: 'reaction-stats-modal',
      message: `
        <div class="p-2 flex flex-wrap gap-2 align-center justify-around">
          <div class="reaction-stat-item">
            <div class="reaction-stat-emoji">❤️</div>
            <div class="reaction-stat-count">${reactions.love}</div>
          </div>
          <div class="reaction-stat-item">
            <div class="reaction-stat-emoji">😊</div>
            <div class="reaction-stat-count">${reactions.happy}</div>
          </div>
          <div class="reaction-stat-item">
            <div class="reaction-stat-emoji">😢</div>
            <div class="reaction-stat-count">${reactions.sad}</div>
          </div>
          <div class="reaction-stat-item">
            <div class="reaction-stat-emoji">😡</div>
            <div class="reaction-stat-count">${reactions.angry}</div>
          </div>
        </div>
      `,
      buttons: [{
        text: this.translate.instant(TranslateKeys.BUTTON_CLOSE),
        role: 'cancel'
      }]
    });

    await alert.present();
  }

  /**
   * Withdraw an entry
   * @param entryId Entry ID
   */
  public async withdrawEntry(entryId: number): Promise<void> {
    const alert = await this.alertController.create({
      header: this.translate.instant(TranslateKeys.ALERT_DEFAULT_HEADER),
      message: this.translate.instant(TranslateKeys.PERSONAL_DIARY_CONFIRM_WITHDRAW),
      buttons: [
        {
          text: this.translate.instant(TranslateKeys.BUTTON_CANCEL),
          role: 'cancel'
        },
        {
          text: this.translate.instant(TranslateKeys.PERSONAL_DIARY_WITHDRAW),
          handler: async () => {
            try {
              // Call service to withdraw entry (now async)
              await this.emotionDiaryService.withdrawEntry(entryId);

              // You could show a success toast here if needed
            } catch (error) {
              console.error("ERROR:", error);
              // You could show an error toast here if needed
            }
            return true; // Close the alert
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Show suggestions for an entry (toggle)
   * @param entry Entry
   * @param event Click event
   */
  public showSuggestionsForEntry(entry: IPersonalDiaryEntry, event?: MouseEvent): void {
    // Prevent event propagation
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    // Toggle suggestions - close if already showing for this entry
    if (this.selectedEntry?.id === entry.id && this.showSuggestions) {
      this.closeSuggestions();
      return;
    }

    // Get suggestions for this emotion type
    const suggestions = this.emotionDiaryService.getEmotionSuggestions(entry.emotionType);

    // Set selected entry and show suggestions
    this.selectedEntry = entry;
    this.showSuggestions = true;

    // Set suggestions if available, otherwise empty array
    this.emotionSuggestions = suggestions?.suggestions || [];
  }

  /**
   * Close suggestions section
   */
  public closeSuggestions(): void {
    this.showSuggestions = false;
    this.selectedEntry = null;
    this.emotionSuggestions = [];
  }

  /**
   * Format timestamp to relative time
   * @param timestamp Timestamp
   * @returns Formatted time string
   */
  public formatTimestamp(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();

    // Less than 1 minute
    if (diff < 60 * 1000) {
      return this.translate.instant('COMMON.just_now');
    }

    // Less than 1 hour
    if (diff < 60 * 60 * 1000) {
      const minutes = Math.floor(diff / (60 * 1000));
      return this.translate.instant('COMMON.minutes_ago', {minutes});
    }

    // Same day
    if (now.getDate() === new Date(timestamp).getDate() &&
      now.getMonth() === new Date(timestamp).getMonth() &&
      now.getFullYear() === new Date(timestamp).getFullYear()) {
      const hours = new Date(timestamp).getHours();
      const minutes = new Date(timestamp).getMinutes();
      return this.translate.instant('COMMON.today_at', {time: `${hours}:${minutes < 10 ? '0' + minutes : minutes}`});
    }

    // Yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (yesterday.getDate() === new Date(timestamp).getDate() &&
      yesterday.getMonth() === new Date(timestamp).getMonth() &&
      yesterday.getFullYear() === new Date(timestamp).getFullYear()) {
      return this.translate.instant('COMMON.yesterday');
    }

    // Default format: DD/MM/YYYY
    const date = new Date(timestamp);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }

  /**
   * Get emotion emoji based on emotion type
   * @param emotionType Emotion type
   * @returns Emotion emoji
   */
  public getEmotionEmoji(emotionType: EmotionType): string {
    return getEmotionEmoji(emotionType);
  }

  /**
   * Get display name for an entry
   * @param entry Entry
   * @returns Display name
   */
  public getDisplayName(entry: IPersonalDiaryEntry): string | undefined {
    if (entry.isAnonymous) {
      return this.translate.instant(TranslateKeys.PERSONAL_DIARY_ANONYMOUS_USER);
    }
    return entry.user.name;
  }

  /**
   * Check if an entry is owned by the current user
   * @param entry Entry
   * @returns Whether the entry is owned by the current user
   */
  public isOwnEntry(entry: IPersonalDiaryEntry): boolean {
    return entry.user.id === this.currentUser?.id;
  }

  /**
   * Open modal to add new diary entry using the EmotionDiaryModalComponent
   */
  public async openAddEntryModal(): Promise<void> {
    // Import the component dynamically to avoid circular dependencies
    const {EmotionDiaryModalComponent} = await import('./emotion-diary-modal/emotion-diary-modal.component');

    const modal = await this.modalController.create({
      component: EmotionDiaryModalComponent,
      cssClass: 'personal-diary-modal',
      componentProps: {
        title: this.translate.instant(TranslateKeys.PERSONAL_DIARY_NEW_ENTRY),
        contentPlaceholder: this.translate.instant(TranslateKeys.PERSONAL_DIARY_CONTENT_PLACEHOLDER),
        emotionTypeLabel: this.translate.instant(TranslateKeys.PERSONAL_DIARY_EMOTION_TYPE),
        anonymousLabel: this.translate.instant(TranslateKeys.PERSONAL_DIARY_ANONYMOUS),
        publicLabel: this.translate.instant(TranslateKeys.PERSONAL_DIARY_PUBLIC),
        cancelButtonLabel: this.translate.instant(TranslateKeys.BUTTON_CANCEL),
        submitButtonLabel: this.translate.instant(TranslateKeys.PERSONAL_DIARY_SUBMIT)
      },
      backdropDismiss: true,
      showBackdrop: true,
      keyboardClose: true,
      animated: true,
      breakpoints: [0, 1],
      initialBreakpoint: 1,
      presentingElement: await this.modalController.getTop()
    });

    await modal.present();

    // Handle modal dismiss and data
    const {data} = await modal.onWillDismiss();

    // If data exists, it means the user submitted the form
    if (data) {
      try {
        // Call service to add diary entry (now async)
        await this.emotionDiaryService.addDiaryEntry(
          data.content,
          data.emotionType,
          data.isAnonymous,
          data.isPublic
        );

      } catch (error) {
        console.error("ERROR:", error)
      }
    }
  }

  /**
   * Get emoji for a reaction type
   * @param reactionType Reaction type or null
   * @returns Emoji for the reaction type
   */
  public getReactionEmoji(reactionType: string | null): string {
    if (!reactionType) return '❤️';
    const reaction = this.reactions.find(r => r.name === reactionType);
    return reaction ? reaction.emoji : '❤️';
  }

  /**
   * Listen for document click events to close popups when clicking outside
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Check if click is outside reaction popup
    if (this.showReactions) {
      const target = event.target as HTMLElement;
      // Check if the click is not on a reaction button or inside the reaction popup
      if (!target.closest('.reaction-popup') && !target.closest('button[title]')) {
        this.closeReactions();
      }
    }
  }

  /**
   * init header
   * @private
   */
  private initHeader(): void {
    this.segment = {
      value: this.currentFilter,
      buttons: [
        {value: EmotionFilterType.MY_ENTRIES, label: TranslateKeys.PERSONAL_DIARY_MY_ENTRIES},
        {value: EmotionFilterType.SHARED_ENTRIES, label: TranslateKeys.PERSONAL_DIARY_SHARED_ENTRIES}
      ]
    };
    this.animeImage = {
      name: 'personal_diary',
      imageUrl: '/assets/images/personal_diary.png',
      width: '250px',
      height: 'auto',
      position: {
        position: 'absolute',
        right: '-50px',
        bottom: '-10px'
      }
    };
  }
}
