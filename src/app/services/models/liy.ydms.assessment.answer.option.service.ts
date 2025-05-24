import { Injectable } from '@angular/core';
import { OdooService } from '../odoo/odoo.service';
import { ModelName } from '../../shared/enums/model-name';
import { ILiyYdmsAssessmentAnswerOption } from '../../shared/interfaces/models/liy.ydms.assessment.answer.option';
import { CommonConstants } from "../../shared/classes/common-constants";
import {OdooDomainOperator} from "../../shared/enums/odoo-domain-operator";

@Injectable({
  providedIn: 'root'
})
export class LiyYdmsAssessmentAnswerOptionService {
  // Fields for assessment answer option model
  private fields = [
    'name',
    'image_1920',
    'scores',
    'encourage',
    'guide_category_ids',
    'question_id',
    'order_weight'
  ];

  constructor(
    private odooService: OdooService
  ) { }

  /**
   * Get answer options for a question
   * @param questionId Question ID
   * @returns Array of answer options
   */
  public async getAnswerOptions(questionId: number): Promise<ILiyYdmsAssessmentAnswerOption[]> {
    try {
      let answerOptions = await this.odooService.searchRead<ILiyYdmsAssessmentAnswerOption>(
        ModelName.ASSESSMENT_ANSWER_OPTION,
        [['question_id',  OdooDomainOperator.EQUAL, questionId]],
        this.fields
      );
      answerOptions = CommonConstants.convertArr2ListItem(answerOptions);

      // Sort options by order_weight if available
      if (answerOptions && answerOptions.length > 0) {
        answerOptions.sort((a, b) => a.order_weight - b.order_weight);
      }

      return answerOptions || [];
    } catch (error) {
      console.error('ERROR getting answer options:', error);
      return [];
    }
  }
}
