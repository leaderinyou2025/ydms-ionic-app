import { Injectable } from '@angular/core';
import { OdooService } from '../odoo/odoo.service';
import { ModelName } from '../../shared/enums/model-name';
import { ITaskDetail, Questions } from 'src/app/shared/interfaces/form/form-assessment.interfaces';
import { ForceTestData } from '../../shared/classes/force-test-data';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(
    private odooService: OdooService
  ) { }

  /**
   * Get task assessment data by ID
   * @param taskId - The ID of the task to retrieve
   * @returns Promise with task details or null
   */
  public async getTaskAssessment(taskId: string | number): Promise<ITaskDetail | null> {
    try {
      // Call the Odoo service to get task data
      // const result = await this.odooService.callKw(
      //   ModelName.TASKS,
      //   'get_task_assessment',
      //   [{ task_id: taskId }]
      // );
      //
      // if (result) {
      //   return {
      //     id: result.id,
      //     name: result.name,
      //     questions: result.questions
      //   };
      // }

      // Force data
      return ForceTestData.tasksDetail;
    } catch (error) {
      console.error('Error getting task assessment:', error);
      return null;
    }
  }

  /**
   * Submit task assessment answers
   * @param taskId - The ID of the task
   * @param answers - The answers to submit
   * @returns Promise with success status
   */
  public async submitTaskAssessment(taskId: number, questions: Questions[]): Promise<boolean> {
    try {
      const answers = questions.map((question, questionIndex) => {
        const selectedOptionIndex = question.options.findIndex(option => option.selected);
        const selectedOption = selectedOptionIndex !== -1 ? question.options[selectedOptionIndex] : null;

        return {
          question_text: question.text,
          question_index: questionIndex,
          selected_option_text: selectedOption?.text || null,
          selected_option_index: selectedOptionIndex !== -1 ? selectedOptionIndex : null
        };
      });

      // Call the Odoo service to submit answers
      // const result = await this.odooService.callKw(
      //   ModelName.TASKS,
      //   'complete_task_assessment',
      //   [{
      //     task_id: taskId,
      //     answers: answers
      //   }]
      // );
      //
      // return !!result;

      // Force success
      console.log('Submitting answers:', answers);
      return true;
    } catch (error) {
      console.error('Error submitting task assessment:', error);
      return false;
    }
  }

  /**
   * Check if all questions have been answered
   * @param questions - The questions to check
   * @returns Array of unanswered questions
   */
  public getUnansweredQuestions(questions: Questions[]): any[] {
    return questions.filter(question =>
      !question.options.some(option => option.selected)
    );
  }
}
