import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { OdooService, SearchDomain } from '../odoo/odoo.service';
import { ModelName } from '../../shared/enums/model-name';
import { OrderBy } from '../../shared/enums/order-by';
import { IEmotionalSurveyHistory, IEmotionalSurveyDetail, IEmotionalSurveyQuestion } from '../../shared/interfaces/emotional-survey/emotional-survey.interfaces';
import { ForceTestData } from '../../shared/classes/force-test-data';
import { EmotionType } from "../../shared/enums/personal-diary/personal-diary.enum";

@Injectable({
  providedIn: 'root'
})
export class EmotionalSurveyService {
  private surveyHistory = new BehaviorSubject<IEmotionalSurveyHistory[]>([]);
  private currentSurvey = new BehaviorSubject<IEmotionalSurveyDetail | null>(null);

  constructor(
    private authService: AuthService,
    private odooService: OdooService
  ) {
    this.loadSurveyHistory();
  }

  /**
   * Get survey history as observable
   */
  public getSurveyHistory(): Observable<IEmotionalSurveyHistory[]> {
    return this.surveyHistory.asObservable();
  }

  /**
   * Get current survey as observable
   */
  public getCurrentSurvey(): Observable<IEmotionalSurveyDetail | null> {
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
      // const surveyHistoryResult = await this.odooService.searchRead<IEmotionalSurveyHistory>(
      //   ModelName.EMOTIONAL_SURVEY_HISTORY,
      //   [['user_id', '=', authData.id]],
      //   ['id', 'date', 'result', 'emotionType', 'score'],
      //   0,
      //   0,
      //   OrderBy.CREATE_AT_DESC
      // );
      //
      // if (surveyHistoryResult?.length) {
      //   this.surveyHistory.next(surveyHistoryResult);
      // }

      // Use mock data from force-test-data
      this.surveyHistory.next(ForceTestData.mockEmotionalSurveyHistory);
    } catch (error) {
      console.error('ERROR:', error);
    }
  }

  /**
   * Get survey detail by ID
   * @param surveyId Survey ID
   */
  public async getSurveyDetail(surveyId: number): Promise<IEmotionalSurveyDetail | null> {
    try {
      // TODO: Implement Odoo API integration
      // const surveyDetailResult = await this.odooService.read<IEmotionalSurveyDetail>(
      //   ModelName.EMOTIONAL_SURVEY_DETAIL,
      //   [surveyId],
      //   ['id', 'date', 'questions', 'result', 'emotionType', 'score', 'feedback']
      // );
      //
      // if (surveyDetailResult?.length) {
      //   const surveyDetail = surveyDetailResult[0];
      //   this.currentSurvey.next(surveyDetail);
      //   return surveyDetail;
      // }

      // Use mock data from force-test-data
      const mockSurveyDetail = ForceTestData.getMockSurveyDetail(surveyId);
      this.currentSurvey.next(mockSurveyDetail);
      return mockSurveyDetail;
    } catch (error) {
      console.error('ERROR:', error);
      return null;
    }
  }

  /**
   * Create a new survey
   */
  public async createNewSurvey(): Promise<IEmotionalSurveyDetail | null> {
    try {
      // TODO: Implement Odoo API integration
      // const authData = await this.authService.getAuthData();
      // if (!authData?.id) return null;
      //
      // const newSurveyResult = await this.odooService.callKw(
      //   ModelName.EMOTIONAL_SURVEY,
      //   'create_new_survey',
      //   [{ user_id: authData.id }]
      // );
      //
      // if (newSurveyResult?.id) {
      //   return this.getSurveyDetail(newSurveyResult.id);
      // }

      // Use mock data from force-test-data
      const mockNewSurvey: IEmotionalSurveyDetail = {
        id: 16, // New ID that doesn't exist in the history
        date: new Date(),
        questions: ForceTestData.mockEmotionalSurveyQuestions.map(q => ({
          ...q,
          options: q.options.map(o => ({ ...o, selected: false }))
        })),
        result: '',
        emotionType: EmotionType.HAPPY,
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
  public async submitSurvey(surveyId: number, questions: IEmotionalSurveyQuestion[]): Promise<boolean> {
    try {
      // TODO: Implement Odoo API integration
      // const result = await this.odooService.callKw(
      //   ModelName.EMOTIONAL_SURVEY,
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

      // Mock success
      console.log('Submitting survey answers:', questions);
      await this.loadSurveyHistory();
      return true;
    } catch (error) {
      console.error('ERROR:', error);
      return false;
    }
  }
}
