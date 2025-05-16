import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {AuthService} from '../auth/auth.service';
import {OdooService, SearchDomain} from '../odoo/odoo.service';
import {ModelName} from '../../shared/enums/model-name';
import {OrderBy} from '../../shared/enums/order-by';
import {
  IFamilyConflictSurveyHistory,
  IFamilyConflictSurveyDetail,
  IFamilyConflictSurveyQuestion,
  IFamilyConflictSurveyOption
} from '../../shared/interfaces/family-conflict-survey/family-conflict-survey.interfaces';
import {ForceTestData} from '../../shared/classes/force-test-data';

@Injectable({
  providedIn: 'root'
})
export class FamilyConflictSurveyService {
  private surveyHistory = new BehaviorSubject<IFamilyConflictSurveyHistory[]>([]);
  private currentSurvey = new BehaviorSubject<IFamilyConflictSurveyDetail | null>(null);

  constructor(
    private authService: AuthService,
    private odooService: OdooService
  ) {
    this.loadSurveyHistory();
  }

  /**
   * Get survey history as observable
   */
  public getSurveyHistory(): Observable<IFamilyConflictSurveyHistory[]> {
    return this.surveyHistory.asObservable();
  }

  /**
   * Get current survey as observable
   */
  public getCurrentSurvey(): Observable<IFamilyConflictSurveyDetail | null> {
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
      // const surveyHistoryResult = await this.odooService.searchRead<IFamilyConflictSurveyHistory>(
      //   ModelName.FAMILY_CONFLICT_SURVEY_HISTORY,
      //   [['user_id', '=', authData.id]],
      //   ['id', 'date', 'result', 'conflictLevel', 'score'],
      //   0,
      //   0,
      //   OrderBy.CREATE_AT_DESC
      // );
      //
      // if (surveyHistoryResult?.length) {
      //   this.surveyHistory.next(surveyHistoryResult);
      // }

      // Use mock data
      this.surveyHistory.next(ForceTestData.mockFamilyConflictSurveyHistory);
    } catch (error) {
      console.error('ERROR:', error);
    }
  }

  /**
   * Get survey detail by ID
   * @param surveyId Survey ID
   */
  public async getSurveyDetail(surveyId: number): Promise<IFamilyConflictSurveyDetail | null> {
    try {
      // TODO: Implement Odoo API integration
      // const surveyDetailResult = await this.odooService.read<IFamilyConflictSurveyDetail>(
      //   ModelName.FAMILY_CONFLICT_SURVEY_DETAIL,
      //   [surveyId],
      //   ['id', 'date', 'questions', 'result', 'conflictLevel', 'score', 'feedback']
      // );
      //
      // if (surveyDetailResult?.length) {
      //   const surveyDetail = surveyDetailResult[0];
      //   this.currentSurvey.next(surveyDetail);
      //   return surveyDetail;
      // }

      // Use mock data
      const historyItem = ForceTestData.mockFamilyConflictSurveyHistory.find(item => item.id === surveyId);
      if (!historyItem) return null;

      const mockSurveyDetail: IFamilyConflictSurveyDetail = {
        id: historyItem.id,
        date: historyItem.date,
        questions: JSON.parse(JSON.stringify(ForceTestData.mockFamilyConflictSurveyQuestions)), // Deep copy
        result: historyItem.result,
        conflictLevel: historyItem.conflictLevel,
        score: historyItem.score,
        feedback: ForceTestData.getFeedbackForConflictScore(historyItem.score)
      };

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
  public async createNewSurvey(): Promise<IFamilyConflictSurveyDetail | null> {
    try {
      // TODO: Implement Odoo API integration
      // const authData = await this.authService.getAuthData();
      // if (!authData?.id) return null;
      //
      // const newSurveyResult = await this.odooService.callKw(
      //   ModelName.FAMILY_CONFLICT_SURVEY,
      //   'create_new_survey',
      //   [{ user_id: authData.id }]
      // );
      //
      // if (newSurveyResult?.id) {
      //   return this.getSurveyDetail(newSurveyResult.id);
      // }

      // Use mock data
      const mockNewSurvey: IFamilyConflictSurveyDetail = {
        id: 100, // New ID that doesn't exist in the history
        date: new Date(),
        questions: JSON.parse(JSON.stringify(ForceTestData.mockFamilyConflictSurveyQuestions)).map((q: IFamilyConflictSurveyQuestion) => ({
          ...q,
          options: q.options.map((o: IFamilyConflictSurveyOption) => ({...o, selected: false}))
        })),
        result: '',
        conflictLevel: '',
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
  public async submitSurvey(surveyId: number, questions: IFamilyConflictSurveyQuestion[]): Promise<boolean> {
    try {
      // TODO: Implement Odoo API integration
      // const result = await this.odooService.callKw(
      //   ModelName.FAMILY_CONFLICT_SURVEY,
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
        const selectedOption = question.options.find(o => o.selected);
        if (selectedOption) {
          totalScore += selectedOption.value;
          answeredQuestions++;
        }
      });

      // Calculate average score and scale to 0-100
      const averageScore = answeredQuestions > 0 ? (totalScore / answeredQuestions) : 0;
      const scaledScore = Math.round((averageScore / 4) * 100); // Assuming max value is 4

      // Determine conflict level and result text
      const conflictLevel = ForceTestData.getConflictLevelFromScore(scaledScore);
      const resultText = ForceTestData.getResultTextFromConflictLevel(conflictLevel);

      // Create new history item
      const newHistoryItem: IFamilyConflictSurveyHistory = {
        id: surveyId,
        date: new Date(),
        result: resultText,
        conflictLevel: conflictLevel,
        score: scaledScore
      };

      // Update history
      const updatedHistory = [newHistoryItem, ...ForceTestData.mockFamilyConflictSurveyHistory];
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
  public areAllQuestionsAnswered(questions: IFamilyConflictSurveyQuestion[]): boolean {
    return questions.every(q => q.options.some(o => o.selected));
  }
};
