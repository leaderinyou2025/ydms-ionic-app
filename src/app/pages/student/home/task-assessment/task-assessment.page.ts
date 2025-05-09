import {Component, OnInit} from '@angular/core';
import {NavController, ToastButton, ToastController, ToastOptions} from '@ionic/angular';
import {PageRoutes} from '../../../../shared/enums/page-routes';
import {TranslateKeys} from "../../../../shared/enums/translate-keys";
import {OdooService} from "../../../../services/odoo/odoo.service";
import {ITaskDetail} from "../../../../shared/interfaces/home/task.interfaces";
import {ForceTestData} from "../../../../shared/classes/force-test-data";
import {ActivatedRoute} from "@angular/router";
import {IonicColors} from "../../../../shared/enums/ionic-colors";
import {IonicIcons} from "../../../../shared/enums/ionic-icons";
import {Position} from "../../../../shared/enums/position";
import {BtnRoles} from "../../../../shared/enums/btn-roles";
import {NativePlatform} from "../../../../shared/enums/native-platform";
import {StyleClass} from "../../../../shared/enums/style-class";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-task-assessment',
  templateUrl: './task-assessment.page.html',
  styleUrls: ['./task-assessment.page.scss'],
  standalone: false,
})
export class TaskAssessmentPage implements OnInit {
  protected readonly PageRoutes = PageRoutes;
  protected readonly TranslateKeys = TranslateKeys;

  public task: ITaskDetail | null = null;
  public isLoading = false;

  constructor(
    private navCtrl: NavController,
    private toastController: ToastController,
    private odooService: OdooService,
    private route: ActivatedRoute,
    private translate: TranslateService,
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
      // Get task ID from route (assuming it's 1 for now)
      const taskId = this.route.snapshot.paramMap.get('id');

      if (taskId) {
        // Call the Odoo service to get task data
        // const result = await this.odooService.callKw(
        //   ModelName.TASKS,
        //   'get_task_assessment',
        //   [{ task_id: taskId }]
        // );
        //
        // if (result) {
        //   this.task = {
        //     id: result.id,
        //     name: result.name,
        //     questions: result.questions
        //   };
        // }

        // Force data
        this.task = ForceTestData.tasksDetail;
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

    setTimeout(() => {
    }, 0);
  }

  /**
   * Complete the task and navigate back
   */
  public async completeTask(): Promise<void> {
    this.isLoading = true;

    try {
      if (!this.task?.id) {
        console.error('Not find task ID');
        return;
      }

      // Check question not asnwered
      const unansweredQuestions = this.task.questions.filter(question =>
        !question.options.some(option => option.selected)
      );

      if (unansweredQuestions.length > 0) {
        this.showToast(this.translate.instant(TranslateKeys.TOAST_ANSWER_ALL_QUESTIONS), IonicColors.WARNING);
        this.isLoading = false;
        return;
      }

      // const answers = this.task?.questions.map((question, questionIndex) => {
      //   const selectedOptionIndex = question.options.findIndex(option => option.selected);
      //   const selectedOption = selectedOptionIndex !== -1 ? question.options[selectedOptionIndex] : null;
      //
      //   return {
      //     question_text: question.text,
      //     question_index: questionIndex,
      //     selected_option_text: selectedOption?.text || null,
      //     selected_option_index: selectedOptionIndex !== -1 ? selectedOptionIndex : null
      //   };
      // }) || [];
      //
      // // Call API to complete the task
      // const result = await this.odooService.callKw(
      //   ModelName.TASKS,
      //   'complete_task_assessment',
      //   [{
      //     task_id: this.task?.id,
      //     answers: answers
      //   }]
      // );
      //
      // if (result) {

      // } else {
      //   throw new Error('Failed to complete task');
      // }

      // Force call success
      this.showToast(this.translate.instant(TranslateKeys.TOAST_TASK_COMPLETE_SUCCESS), IonicColors.SUCCESS);
      setTimeout(() => {
        this.navigateBack();
      }, 2000);

    } catch (error) {
      console.error('Error completing task:', error);
      this.showToast(TranslateKeys.TOAST_TASK_COMPLETE_ERROR, IonicColors.DANGER);
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
  public getSelectedOptionIndex(question: any): number {
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
