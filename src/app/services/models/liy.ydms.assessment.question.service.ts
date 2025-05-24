import { Injectable } from '@angular/core';
import { OdooService } from '../odoo/odoo.service';
import { ModelName } from '../../shared/enums/model-name';
import { ILiyYdmsAssessmentQuestion } from '../../shared/interfaces/models/liy.ydms.assessment.question';
import { CommonConstants } from "../../shared/classes/common-constants";
import {OdooDomainOperator} from "../../shared/enums/odoo-domain-operator";

@Injectable({
  providedIn: 'root'
})
export class LiyYdmsAssessmentQuestionService {
  // Fields for assessment question model
  private fields = [
    'name',
    'description',
    'answer_ids',
    'order_weight',
    'answer_type',
    'display_type',
    'assessment_id',
    'scores'
  ];

  constructor(
    private odooService: OdooService
  ) { }

  /**
   * Get assessment questions by assessment ID
   * @param assessmentId Assessment ID
   * @returns Array of assessment questions
   */
  public async getAssessmentQuestions(assessmentId: number): Promise<ILiyYdmsAssessmentQuestion[]> {
    try {
      let questionDetail = await this.odooService.searchRead<ILiyYdmsAssessmentQuestion>(
        ModelName.ASSESSMENT_QUESTION,
        [['assessment_id',  OdooDomainOperator.EQUAL, assessmentId]],
        this.fields
      );
      questionDetail = CommonConstants.convertArr2ListItem(questionDetail);

      // Sort questions by order_weight
      if (questionDetail && questionDetail.length > 0) {
        questionDetail.sort((a, b) => a.order_weight - b.order_weight);
      }

      return questionDetail || [];
    } catch (error) {
      console.error('ERROR getting assessment questions:', error);
      return [];
    }
  }
}
