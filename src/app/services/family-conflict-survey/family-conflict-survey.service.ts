import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { LiyYdmsAssessmentResultService } from '../models/liy.ydms.assessment.result.service';
import { LiyYdmsAssessmentService } from '../models/liy.ydms.assessment.service';
import { LiyYdmsAssessmentQuestionService } from '../models/liy.ydms.assessment.question.service';
import { LiyYdmsAssessmentAnswerOptionService } from '../models/liy.ydms.assessment.answer.option.service';
import { LiyYdmsAssessmentAnswerResultService } from '../models/liy.ydms.assessment.answer.result.service';
import {
  IFamilyConflictSurveyDetail,
  IFamilyConflictSurveyQuestion,
  IFamilyConflictSurveyOption
} from '../../shared/interfaces/family-conflict-survey/family-conflict-survey.interfaces';
import { ILiyYdmsAssessmentResult } from '../../shared/interfaces/models/liy.ydms.assessment.result';
import { ConflictLevel } from '../../shared/enums/family-conflict-survey/conflict-level';
import { TranslateService } from '@ngx-translate/core';
import { TranslateKeys } from '../../shared/enums/translate-keys';
import { AnswerType } from '../../shared/enums/answer-type';
import {AreaOfExpertise} from "../../shared/enums/area-of-expertise";

@Injectable({
  providedIn: 'root'
})
export class FamilyConflictSurveyService {

  private surveyHistory = new BehaviorSubject<ILiyYdmsAssessmentResult[]>([]);
  private currentSurvey = new BehaviorSubject<IFamilyConflictSurveyDetail | null>(null);

  constructor(
    private authService: AuthService,
    private liyYdmsAssessmentResultService: LiyYdmsAssessmentResultService,
    private liyYdmsAssessmentService: LiyYdmsAssessmentService,
    private liyYdmsAssessmentQuestionService: LiyYdmsAssessmentQuestionService,
    private liyYdmsAssessmentAnswerOptionService: LiyYdmsAssessmentAnswerOptionService,
    private liyYdmsAssessmentAnswerResultService: LiyYdmsAssessmentAnswerResultService,
    private translateService: TranslateService
  ) {
    this.loadSurveyHistory();
  }

  /**
   * Get survey history as observable
   */
  public getSurveyHistory(): Observable<ILiyYdmsAssessmentResult[]> {
    return this.surveyHistory.asObservable();
  }

  /**
   * Get current survey as observable
   */
  public getCurrentSurvey(): Observable<IFamilyConflictSurveyDetail | null> {
    return this.currentSurvey.asObservable();
  }

  /**
   * Tải lịch sử khảo sát xung đột gia đình
   */
  private async loadSurveyHistory(): Promise<void> {
    try {
      const authData = await this.authService.getAuthData();
      if (!authData?.id) return;

      const surveyHistoryResult = await this.liyYdmsAssessmentResultService.loadAssessmentResult(AreaOfExpertise.CONFLICT);
      if (surveyHistoryResult?.length) {
        this.surveyHistory.next(surveyHistoryResult);
      }
    } catch (error) {
      console.error('ERROR:', error);
    }
  }

  /**
   * Lấy chi tiết khảo sát theo ID
   * @param surveyId ID của khảo sát
   */
  public async getSurveyDetail(surveyId: number): Promise<IFamilyConflictSurveyDetail | null> {
    try {
      const assessment = await this.liyYdmsAssessmentService.getAssessmentById(surveyId);
      if (!assessment) return null;

      // Lấy danh sách câu hỏi
      const questions = await this.liyYdmsAssessmentQuestionService.getAssessmentQuestions(surveyId);

      // Lấy các lựa chọn trả lời cho từng câu hỏi
      const questionsWithOptions: IFamilyConflictSurveyQuestion[] = [];

      for (const question of questions) {
        const answerOptions = await this.liyYdmsAssessmentAnswerOptionService.getAnswerOptions(question.id);

        // Sắp xếp các lựa chọn theo order_weight
        const sortedAnswerOptions = [...answerOptions].sort((a, b) => a.order_weight - b.order_weight);

        questionsWithOptions.push({
          ...question,
          text: question.name,
          answer_type: question.answer_type,
          answer_text: '',
          options: sortedAnswerOptions.map(option => {
            const mappedOption: IFamilyConflictSurveyOption = {
              id: option.id,
              selected: false,
              text: option.name,
              value: option.scores,
              name: option.name,
              scores: option.scores,
              encourage: option.encourage,
              order_weight: option.order_weight,
              question_id: option.question_id
            };
            return mappedOption;
          })
        });
      }

      // Lấy kết quả trả lời
      const answerResults = await this.liyYdmsAssessmentAnswerResultService.getAssessmentAnswerResults(surveyId);

      if (answerResults?.length) {
        // Khởi tạo tổng điểm
        let totalScore = 0;

        for (const question of questionsWithOptions) {
          const answer = answerResults.find(result => result?.question_id?.id === question.id);
          if (answer) {
            if (question.answer_type === AnswerType.SELECT_OPTION) {
              const option = question.options.find(opt => opt.id === answer.answer_id?.id);
              if (option) {
                option.selected = true;
                totalScore += option.value !== undefined ? option.value : (option.scores || 0);
              }
            } else if (question.answer_type === AnswerType.INPUT_TEXT) {
              question.answer_text = answer.answer_text || '';
              if (question.answer_text && question.answer_text.trim() !== '') {
                totalScore += question.scores || 0;
              }
            }
          }
        }

        // Tính toán mức độ xung đột dựa trên tỉ lệ điểm số
        const maxPossibleScore = this.calculateMaxPossibleScore(questionsWithOptions);
        const conflictLevel = this.calculateConflictLevel(totalScore, maxPossibleScore);
        const resultText = this.getResultTextFromConflictLevel(conflictLevel);
        const feedback = this.getFeedbackForConflictLevel(conflictLevel);

        const surveyDetail: IFamilyConflictSurveyDetail = {
          id: surveyId,
          date: new Date(assessment.execution_date || new Date()),
          questions: questionsWithOptions,
          result: resultText,
          conflictLevel: conflictLevel,
          score: totalScore,
          feedback: feedback,
          assessment: assessment,
          answerResults: answerResults
        };
        this.currentSurvey.next(surveyDetail);
        return surveyDetail;
      }
      return null;
    } catch (error) {
      console.error('ERROR:', error);
      return null;
    }
  }

  /**
   * Tính toán điểm tối đa có thể đạt được cho tất cả câu hỏi
   * @param questions Danh sách câu hỏi khảo sát với các lựa chọn
   * @returns Điểm tối đa có thể đạt được
   */
  private calculateMaxPossibleScore(questions: IFamilyConflictSurveyQuestion[]): number {
    let maxScore = 0;

    questions.forEach(question => {
      if (question.answer_type === AnswerType.SELECT_OPTION) {
        if (question.options && question.options.length > 0) {
          // Tìm điểm cao nhất trong tất cả các lựa chọn cho câu hỏi này
          const maxOptionScore = Math.max(...question.options.map(option => {
            if (option.value !== undefined) return option.value;
            if (option.scores !== undefined) return option.scores;
            return 0;
          }));
          maxScore += maxOptionScore;
        }
      } else if (question.answer_type === AnswerType.INPUT_TEXT) {
        // Đối với INPUT_TEXT, sử dụng giá trị điểm của câu hỏi
        maxScore += question.scores || 0;
      }
    });

    return maxScore;
  }

  /**
   * Tính toán mức độ xung đột dựa trên tỉ lệ điểm số
   * @param userScore Tổng điểm của người dùng
   * @param maxScore Điểm tối đa có thể đạt được
   * @returns Mức độ xung đột: 'thấp', 'trung bình', 'cao'
   */
  private calculateConflictLevel(userScore: number, maxScore: number): ConflictLevel {
    if (maxScore === 0) return ConflictLevel.Low;

    const ratio = userScore / maxScore;

    if (ratio <= 0.33) {
      return ConflictLevel.High;
    } else if (ratio <= 0.66) {
      return ConflictLevel.Medium;
    } else {
      return ConflictLevel.Low;
    }
  }

  /**
   * Lấy văn bản kết quả từ mức độ xung đột
   * @param conflictLevel Mức độ xung đột
   * @returns Văn bản kết quả
   */
  private getResultTextFromConflictLevel(conflictLevel: ConflictLevel): string {
    switch (conflictLevel) {
      case ConflictLevel.Low:
        return this.translateService.instant(TranslateKeys.CONFLICT_LEVEL_LOW);
      case ConflictLevel.Medium:
        return this.translateService.instant(TranslateKeys.CONFLICT_LEVEL_MEDIUM);
      case ConflictLevel.High:
        return this.translateService.instant(TranslateKeys.CONFLICT_LEVEL_HIGH);
      default:
        return this.translateService.instant(TranslateKeys.CONFLICT_LEVEL_UNKNOWN);
    }
  }

  /**
   * Lấy phản hồi cho mức độ xung đột
   * @param conflictLevel Mức độ xung đột
   * @returns Văn bản phản hồi
   */
  private getFeedbackForConflictLevel(conflictLevel: ConflictLevel): string {
    switch (conflictLevel) {
      case ConflictLevel.Low:
        return this.translateService.instant(TranslateKeys.CONFLICT_FEEDBACK_LOW);
      case ConflictLevel.Medium:
        return this.translateService.instant(TranslateKeys.CONFLICT_FEEDBACK_MEDIUM);
      case ConflictLevel.High:
        return this.translateService.instant(TranslateKeys.CONFLICT_FEEDBACK_HIGH);
      default:
        return this.translateService.instant(TranslateKeys.CONFLICT_FEEDBACK_UNKNOWN);
    }
  }

}
