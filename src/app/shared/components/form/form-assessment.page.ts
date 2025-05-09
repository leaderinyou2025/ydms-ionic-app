import { Component, OnInit } from '@angular/core';
import { NavController, ToastButton, ToastController, ToastOptions } from '@ionic/angular';
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

import { PageRoutes } from '../../enums/page-routes';
import { TranslateKeys } from "../../enums/translate-keys";
import { IonicColors } from "../../enums/ionic-colors";
import { IonicIcons } from "../../enums/ionic-icons";
import { Position } from "../../enums/position";
import { BtnRoles } from "../../enums/btn-roles";
import { NativePlatform } from "../../enums/native-platform";
import { StyleClass } from "../../enums/style-class";
import { FormService } from "../../../services/form/form.service";
import { ITaskDetail } from '../../interfaces/form/form-assessment.interfaces';

@Component({
  selector: 'app-task-assessment',
  templateUrl: './form-assessment.page.html',
  styleUrls: ['./form-assessment.page.scss'],
  standalone: false,
})
export class FormAssessmentPage implements OnInit {
  protected readonly PageRoutes = PageRoutes;
  protected readonly TranslateKeys = TranslateKeys;

  public task: ITaskDetail | null = null;
  public isLoading = false;

  constructor(
    private navCtrl: NavController,
    private toastController: ToastController,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private formService: FormService
  ) {
  }

  ngOnInit() {
    this.loadTaskData();
  }

  /**
   * Load task data from server
   */
  private async loadTaskData(): Promise<void> {
    this.isLoading = true;

    try {
      // Get task ID from route
      const taskId = this.route.snapshot.paramMap.get('id');

      if (taskId) {
        // Call the form service to get task data
        this.task = await this.formService.getTaskAssessment(taskId);

        if (!this.task) {
          console.error('Failed to load task data');
        }
      } else {
        console.error('No task ID provided in URL');
      }
    } catch (error) {
      console.error('Error loading task data:', error);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Select an option for a question
   */
  public selectOption(questionIndex: number, event: any): void {
    if (!event || !event.detail || typeof event.detail.value !== 'number') {
      console.error('Invalid event in selectOption', event);
      return;
    }

    const optionIndex = event.detail.value;

    if (!this.task?.questions[questionIndex] || !this.task?.questions[questionIndex].options[optionIndex]) {
      console.error('Invalid question or option index', questionIndex, optionIndex);
      return;
    }

    this.task?.questions[questionIndex].options.forEach(option => {
      option.selected = false;
    });

    this.task.questions[questionIndex].options[optionIndex].selected = true;
  }

  /**
   * Complete the task and navigate back
   */
  public async completeTask(): Promise<void> {
    this.isLoading = true;

    try {
      if (!this.task?.id) {
        console.error('Task ID not found');
        return;
      }

      // Check for unanswered questions
      const unansweredQuestions = this.formService.getUnansweredQuestions(this.task.questions);

      if (unansweredQuestions.length > 0) {
        this.showToast(this.translate.instant(TranslateKeys.TOAST_ANSWER_ALL_QUESTIONS), IonicColors.WARNING);
        this.isLoading = false;
        return;
      }

      // Submit the assessment
      const success = await this.formService.submitTaskAssessment(this.task.id, this.task.questions);

      if (success) {
        this.showToast(this.translate.instant(TranslateKeys.TOAST_TASK_COMPLETE_SUCCESS), IonicColors.SUCCESS);
        setTimeout(() => {
          this.navigateBack();
        }, 2000);
      } else {
        throw new Error('Failed to complete task');
      }
    } catch (error) {
      console.error('Error completing task:', error);
      this.showToast(this.translate.instant(TranslateKeys.TOAST_TASK_COMPLETE_ERROR), IonicColors.DANGER);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Navigate back to home
   */
  public navigateBack(): void {
    this.navCtrl.navigateBack(`/${PageRoutes.HOME}`);
  }

  /**
   * Get the index of the selected option for a question
   */
  public getSelectedOptionIndex(question: any): number | null {
    const selectedIndex = question.options.findIndex((option: any) => option.selected);
    return selectedIndex !== -1 ? selectedIndex : null;
  }

  /**
   * Show toast message
   * @param message
   * @param color
   * @private
   */
  private showToast(message: string, color: IonicColors.SUCCESS | IonicColors.DANGER | IonicColors.WARNING): void {
    const closeBtn: ToastButton = {
      icon: IonicIcons.CLOSE_CIRCLE_OUTLINE,
      side: Position.END,
      role: BtnRoles.CANCEL,
    }
    const toastOption: ToastOptions = {
      message,
      duration: 3000,
      buttons: [closeBtn],
      mode: NativePlatform.IOS,
      cssClass: `${StyleClass.TOAST_ITEM} ${(color === IonicColors.DANGER || color === IonicColors.WARNING) ? StyleClass.TOAST_ERROR : StyleClass.TOAST_SUCCESS}`,
      position: Position.TOP,
      icon: (color === IonicColors.DANGER || color === IonicColors.WARNING) ? IonicIcons.WARNING_OUTLINE : IonicIcons.CHECKMARK_CIRCLE_OUTLINE,
      color,
      keyboardClose: false
    }
    this.toastController.create(toastOption).then(toast => toast.present());
  }
}
