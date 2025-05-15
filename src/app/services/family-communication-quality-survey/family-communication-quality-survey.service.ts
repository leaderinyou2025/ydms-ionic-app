import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { OdooService, SearchDomain } from '../odoo/odoo.service';
import { ModelName } from '../../shared/enums/model-name';
import { OrderBy } from '../../shared/enums/order-by';
import {
  IFamilyCommunicationQualitySurveyHistory,
  IFamilyCommunicationQualitySurveyDetail,
  IFamilyCommunicationQualitySurveyQuestion,
  IFamilyCommunicationQualitySurveyOption
} from '../../shared/interfaces/family-communication-quality-survey/family-communication-quality-survey.interfaces';
import { ForceTestData } from '../../shared/classes/force-test-data';

@Injectable({
  providedIn: 'root'
})
export class FamilyCommunicationQualitySurveyService {
  private surveyHistory = new BehaviorSubject<IFamilyCommunicationQualitySurveyHistory[]>([]);
  private currentSurvey = new BehaviorSubject<IFamilyCommunicationQualitySurveyDetail | null>(null);

  constructor(
    private authService: AuthService,
    private odooService: OdooService
  ) {
    this.loadSurveyHistory();
  }

  /**
   * Get survey history as observable
   */
  public getSurveyHistory(): Observable<IFamilyCommunicationQualitySurveyHistory[]> {
    return this.surveyHistory.asObservable();
  }

  /**
   * Get current survey as observable
   */
  public getCurrentSurvey(): Observable<IFamilyCommunicationQualitySurveyDetail | null> {
    return this.currentSurvey.asObservable();
  }

  /**
   * Load survey history
   */
  private async loadSurveyHistory(): Promise<void> {
    try {
      // TODO: Implement Odoo API integration
      // const authData = await this.authService.getAuthData();
      // if (!authData?.id) return;
      //
      // const surveyHistoryResult = await this.odooService.searchRead<IFamilyCommunicationQualitySurveyHistory>(
      //   ModelName.FAMILY_COMMUNICATION_QUALITY_SURVEY_HISTORY,
      //   [['user_id', '=', authData.id]],
      //   ['id', 'date', 'result', 'communicationLevel', 'score'],
      //   0,
      //   0,
      //   OrderBy.CREATE_AT_DESC
      // );
      //
      // if (surveyHistoryResult?.length) {
      //   this.surveyHistory.next(surveyHistoryResult);
      // }

      // Use mock data from ForceTestData
      this.surveyHistory.next(ForceTestData.familyCommunicationQualitySurveyHistory);
    } catch (error) {
      console.error('ERROR:', error);
    }
  }

  /**
   * Get survey detail by ID
   * @param surveyId Survey ID
   */
  public async getSurveyDetail(surveyId: number): Promise<IFamilyCommunicationQualitySurveyDetail | null> {
    try {
      // TODO: Implement Odoo API integration
      // const surveyDetailResult = await this.odooService.read<IFamilyCommunicationQualitySurveyDetail>(
      //   ModelName.FAMILY_COMMUNICATION_QUALITY_SURVEY_DETAIL,
      //   [surveyId],
      //   ['id', 'date', 'questions', 'result', 'communicationLevel', 'score', 'feedback']
      // );
      //
      // if (surveyDetailResult?.length) {
      //   const surveyDetail = surveyDetailResult[0];
      //   this.currentSurvey.next(surveyDetail);
      //   return surveyDetail;
      // }

      // Use mock data from ForceTestData
      const historyItem = ForceTestData.familyCommunicationQualitySurveyHistory.find(item => item.id === surveyId);
      if (!historyItem) return null;

      const mockSurveyDetail: IFamilyCommunicationQualitySurveyDetail = {
        id: historyItem.id,
        date: historyItem.date,
        questions: JSON.parse(JSON.stringify(ForceTestData.familyCommunicationQualitySurveyQuestions)),
        result: historyItem.result,
        communicationLevel: historyItem.communicationLevel,
        score: historyItem.score,
        feedback: ForceTestData.getFeedbackForCommunicationScore(historyItem.score)
      };

      this.currentSurvey.next(mockSurveyDetail);
      return mockSurveyDetail;
    } catch (error) {
      console.error('ERROR:', error);
      return null;
    }
  }

  /**
   * Create new survey
   */
  public async createNewSurvey(): Promise<IFamilyCommunicationQualitySurveyDetail | null> {
    try {
      // TODO: Implement Odoo API integration
      // const authData = await this.authService.getAuthData();
      // if (!authData?.id) return null;
      //
      // const newSurveyResult = await this.odooService.callKw(
      //   ModelName.FAMILY_COMMUNICATION_QUALITY_SURVEY,
      //   'create_new_survey',
      //   [{ user_id: authData.id }]
      // );
      //
      // if (newSurveyResult?.id) {
      //   return this.getSurveyDetail(newSurveyResult.id);
      // }

      // Use mock data from ForceTestData
      const mockNewSurvey: IFamilyCommunicationQualitySurveyDetail = {
        id: 100, // New ID that doesn't exist in the history
        date: new Date(),
        questions: JSON.parse(JSON.stringify(ForceTestData.familyCommunicationQualitySurveyQuestions)).map((q: IFamilyCommunicationQualitySurveyQuestion) => ({
          ...q,
          options: q.options.map((o: IFamilyCommunicationQualitySurveyOption) => ({ ...o, selected: false }))
        })),
        result: '',
        communicationLevel: '',
        score: 0,
        feedback: ''
      };

      this.currentSurvey.next(mockNewSurvey);
      return mockNewSurvey;
    } catch (error) {
      console.error('ERROR:', error);
      return null;
    }
  }

  /**
   * Submit survey answers
   * @param surveyId Survey ID
   * @param questions Survey questions with answers
   */
  public async submitSurvey(surveyId: number, questions: IFamilyCommunicationQualitySurveyQuestion[]): Promise<boolean> {
    try {
      // TODO: Implement Odoo API integration
      // const result = await this.odooService.callKw(
      //   ModelName.FAMILY_COMMUNICATION_QUALITY_SURVEY,
      //   'submit_survey',
      //   [{
      //     survey_id: surveyId,
      //     answers: questions.map(q => ({
      //       question_id: q.id,
      //       selected_option_id: q.options.find(o => o.selected)?.id
      //     }))
      //   }]
      // );
      //
      // if (result?.success) {
      //   await this.loadSurveyHistory();
      //   return true;
      // }

      // Calculate score based on selected options
      let totalScore = 0;
      let answeredQuestions = 0;

      questions.forEach(question => {
        const selectedOption = question.options.find(option => option.selected);
        if (selectedOption) {
          totalScore += selectedOption.value;
          answeredQuestions++;
        }
      });

      // Calculate average score (0-100 scale)
      const maxPossibleScore = answeredQuestions * 4; // 4 is the max value for each question
      const scorePercentage = Math.round((totalScore / maxPossibleScore) * 100);

      // Determine communication level based on score
      const communicationLevel = ForceTestData.getCommunicationLevelFromScore(scorePercentage);
      const result = ForceTestData.getResultTextFromCommunicationLevel(communicationLevel);
      const feedback = ForceTestData.getFeedbackForCommunicationScore(scorePercentage);

      // Create new history item
      const newHistoryItem: IFamilyCommunicationQualitySurveyHistory = {
        id: Date.now(), // Use timestamp as ID for mock data
        date: new Date(),
        result,
        communicationLevel,
        score: scorePercentage
      };

      // Update history
      const updatedHistory = [newHistoryItem, ...ForceTestData.familyCommunicationQualitySurveyHistory];
      this.surveyHistory.next(updatedHistory);

      return true;
    } catch (error) {
      console.error('ERROR:', error);
      return false;
    }
  }

  /**
   * Check if all questions are answered
   * @param questions Survey questions
   */
  public areAllQuestionsAnswered(questions: IFamilyCommunicationQualitySurveyQuestion[]): boolean {
    return questions.every(q => q.options.some(o => o.selected));
  }
}
