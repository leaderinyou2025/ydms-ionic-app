import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, ToastButton, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { IEmotionalSurveyDetail, IEmotionalSurveyQuestion } from '../../../../shared/interfaces/emotional-survey/emotional-survey.interfaces';
import { TranslateKeys } from '../../../../shared/enums/translate-keys';
import { PageRoutes } from '../../../../shared/enums/page-routes';
import { getEmotionEmoji } from '../../../../shared/data/emotion-options.data';
import { EmotionType } from "../../../../shared/enums/personal-diary/personal-diary.enum";
import { EmotionalSurveyService } from '../../../../services/emotional-survey/emotional-survey.service';
import { IonicColors } from '../../../../shared/enums/ionic-colors';
import { IonicIcons } from '../../../../shared/enums/ionic-icons';
import { BtnRoles } from '../../../../shared/enums/btn-roles';
import { NativePlatform } from '../../../../shared/enums/native-platform';
import { StyleClass } from '../../../../shared/enums/style-class';

@Component({
  selector: 'app-emotional-survey-detail',
  templateUrl: './emotional-survey-detail.component.html',
  styleUrls: ['./emotional-survey-detail.component.scss'],
  standalone: false,
})
export class EmotionalSurveyDetailComponent implements OnInit {
  surveyDetail!: IEmotionalSurveyDetail;
  isLoading: boolean = true;

  protected readonly TranslateKeys = TranslateKeys;
  protected readonly PageRoutes = PageRoutes;

  constructor(
    private route: ActivatedRoute,
    private emotionalSurveyService: EmotionalSurveyService,
    private loadingController: LoadingController,
    private translate: TranslateService,
    private toastController: ToastController
  ) { }

  async ngOnInit() {
    await this.loadSurveyDetail();
  }

  /**
   * Load survey detail from route parameter
   */
  private async loadSurveyDetail(): Promise<void> {
    const loading = await this.loadingController.create({
      message: this.translate.instant(TranslateKeys.TITLE_LOADING_MORE),
      spinner: 'crescent'
    });
    await loading.present();

    try {
      const id = this.route.snapshot.paramMap.get('id');
      if (!id) {
        throw new Error('Survey ID not found');
      }

      const surveyDetail = await this.emotionalSurveyService.getSurveyDetail(parseInt(id, 10));
      if (!surveyDetail) {
        throw new Error('Failed to load survey detail');
      }

      this.surveyDetail = surveyDetail;
    } catch (error) {
      console.error('ERROR:', error);
      this.showToast(this.translate.instant('ERROR.server'), IonicColors.DANGER);
    } finally {
      this.isLoading = false;
      await loading.dismiss();
    }
  }

  /**
   * Format date
   * @param date Date
   */
  public formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Get emotion emoji
   * @param emotionType Emotion type
   */
  public getEmotionEmoji(emotionType: string): string {
    return getEmotionEmoji(emotionType as EmotionType);
  }

  /**
   * Get the selected option value for a question
   * @param question The question to get the selected option for
   * @returns The ID of the selected option or null if no option is selected
   */
  public getSelectedOptionValue(question: IEmotionalSurveyQuestion): number | null {
    const selectedOption = question.options.find(option => option.selected);
    return selectedOption ? selectedOption.id : null;
  }

  /**
   * Show toast message
   * @param message Message
   * @param color Color
   */
  private async showToast(message: string, color: IonicColors.SUCCESS | IonicColors.DANGER | IonicColors.WARNING | IonicColors.PRIMARY): Promise<void> {
    const closeBtn: ToastButton = {
      icon: IonicIcons.CLOSE_CIRCLE_OUTLINE,
      side: 'end',
      role: BtnRoles.CANCEL,
    };

    const toast = await this.toastController.create({
      message,
      duration: 3000,
      buttons: [closeBtn],
      mode: NativePlatform.IOS,
      cssClass: `${StyleClass.TOAST_ITEM} ${(color === IonicColors.DANGER || color === IonicColors.WARNING) ? StyleClass.TOAST_ERROR : (color === IonicColors.PRIMARY ? StyleClass.TOAST_INFO : StyleClass.TOAST_SUCCESS)}`,
      position: 'top',
      icon: (color === IonicColors.DANGER || color === IonicColors.WARNING) ? IonicIcons.WARNING_OUTLINE : (color === IonicColors.PRIMARY ? IonicIcons.INFORMATION_CIRCLE_OUTLINE : IonicIcons.CHECKMARK_CIRCLE_OUTLINE),
      color,
      keyboardClose: false
    });

    await toast.present();
  }
}
