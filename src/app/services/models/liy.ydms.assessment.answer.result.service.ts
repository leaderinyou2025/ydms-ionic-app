import { Injectable } from '@angular/core';
import { OdooService } from '../odoo/odoo.service';
import { ModelName } from '../../shared/enums/model-name';
import { ILiyYdmsAssessmentAnswerResult } from '../../shared/interfaces/models/liy.ydms.assessment.answer.result';
import { CommonConstants } from "../../shared/classes/common-constants";
import {OdooDomainOperator} from "../../shared/enums/odoo-domain-operator";

@Injectable({
  providedIn: 'root'
})
export class LiyYdmsAssessmentAnswerResultService {
  // Fields for assessment answer result model
  private fields = [
    'assessment_result_id',
    'question_id',
    'question_name',
    'answer_id',
    'answer_text',
    'scores'
  ];

  constructor(
    private odooService: OdooService
  ) { }

  /**
   * Get assessment answer results by assessment result ID
   * @param assessmentResultId Assessment result ID
   * @returns Array of assessment answer results
   */
  public async getAssessmentAnswerResults(assessmentResultId: number): Promise<ILiyYdmsAssessmentAnswerResult[]> {
    try {
      let answerResults = await this.odooService.searchRead<ILiyYdmsAssessmentAnswerResult>(
        ModelName.ASSESSMENT_ANSWER_RESULT,
        [['assessment_result_id', OdooDomainOperator.EQUAL, assessmentResultId]],
        this.fields
      );
      answerResults = CommonConstants.convertArr2ListItem(answerResults);
      return answerResults || [];
    } catch (error) {
      console.error('ERROR getting assessment answer results:', error);
      return [];
    }
  }
}
