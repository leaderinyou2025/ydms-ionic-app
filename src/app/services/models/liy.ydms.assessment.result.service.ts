import { Injectable } from '@angular/core';
import { OdooService } from '../odoo/odoo.service';
import { ModelName } from '../../shared/enums/model-name';
import { ILiyYdmsAssessmentResult } from '../../shared/interfaces/models/liy.ydms.assessment.result';
import { CommonConstants } from "../../shared/classes/common-constants";
import {OdooDomainOperator} from "../../shared/enums/odoo-domain-operator";

@Injectable({
  providedIn: 'root'
})
export class LiyYdmsAssessmentResultService {
  // Fields for assessment result model
  private fields = [
    'nickname',
    'assessment_id',
    'name',
    'rank_point',
    'area_of_expertise'
  ];

  constructor(
    private odooService: OdooService
  ) { }

  /**
   * Load survey history by area of expertise
   * @param areaOfExpertise Area of expertise (e.g., 'conflict', 'stress', etc.)
   * @param limit Number of records to return (default: 10)
   * @param offset Offset for pagination (default: 0)
   * @returns Array of survey history results
   */
  public async loadAssessmentResult(
    areaOfExpertise: string,
    offset: number = 0,
    limit: number = 10
  ): Promise<ILiyYdmsAssessmentResult[]> {
    try {
      let surveyHistoryResult = await this.odooService.searchRead<ILiyYdmsAssessmentResult>(
        ModelName.ASSESSMENT_RESULT,
        [['area_of_expertise', OdooDomainOperator.EQUAL, areaOfExpertise]],
        this.fields,
        offset,
        limit
      );
      surveyHistoryResult = CommonConstants.convertArr2ListItem(surveyHistoryResult);
      return surveyHistoryResult || [];
    } catch (error) {
      console.error('ERROR loading survey history:', error);
      return [];
    }
  }
}
