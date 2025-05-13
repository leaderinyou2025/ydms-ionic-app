import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { EmotionType } from '../../../../shared/enums/personal-diary/personal-diary.enum';
import { EMOTION_OPTIONS } from '../../../../shared/data/emotion-options.data';
import { EmotionOption } from "../../../../shared/interfaces/personal-diary/personal-diary.interfaces";

@Component({
  selector: 'app-personal-diary-modal',
  templateUrl: './emotion-diary-modal.component.html',
  styleUrls: ['./emotion-diary-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, TranslateModule]
})
export class EmotionDiaryModalComponent implements OnInit {
  @Input() title: string = '';
  @Input() contentPlaceholder: string = '';
  @Input() emotionTypeLabel: string = '';
  @Input() anonymousLabel: string = '';
  @Input() publicLabel: string = '';
  @Input() cancelButtonLabel: string = '';
  @Input() submitButtonLabel: string = '';

  @Output() submitEntry = new EventEmitter<{
    content: string;
    emotionType: EmotionType;
    isAnonymous: boolean;
    isPublic: boolean;
  }>();

  @Output() cancelModal = new EventEmitter<void>();

  content: string = '';
  selectedEmotion: EmotionType = EmotionType.HAPPY;
  isAnonymous: boolean = false;
  isPublic: boolean = true;

  // Use shared emotion options data
  emotions: EmotionOption[] = EMOTION_OPTIONS;

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  selectEmotion(emotion: EmotionType): void {
    this.selectedEmotion = emotion;
  }

  /**
   * Submit the form and dismiss the modal with data
   */
  submit(): void {
    if (!this.content || this.content.trim() === '') {
      return;
    }

    const data = {
      content: this.content.trim(),
      emotionType: this.selectedEmotion,
      isAnonymous: this.isAnonymous,
      isPublic: this.isPublic
    };

    // Emit the event for components using this as a regular component
    this.submitEntry.emit(data);

    // Dismiss the modal with data for modal usage
    this.modalController.dismiss(data);
  }

  /**
   * Cancel and dismiss the modal without data
   */
  cancel(): void {
    // Emit the event for components using this as a regular component
    this.cancelModal.emit();

    // Dismiss the modal without data
    this.modalController.dismiss();
  }
}
