import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { OdooService, SearchDomain } from '../odoo/odoo.service';
import { ModelName } from '../../shared/enums/model-name';
import { OrderBy } from '../../shared/enums/order-by';
import {
  IFamilyDialogueSessionHistory,
  IFamilyDialogueSessionDetail,
  IFamilyDialogueSessionQuestion
} from '../../shared/interfaces/family-dialogue-session/family-dialogue-session.interfaces';
import { ForceTestData } from '../../shared/classes/force-test-data';

@Injectable({
  providedIn: 'root'
})
export class FamilyDialogueSessionService {
  private sessionHistory = new BehaviorSubject<IFamilyDialogueSessionHistory[]>([]);
  private isLoading = new BehaviorSubject<boolean>(false);

  constructor(
    private authService: AuthService,
    private odooService: OdooService
  ) { }

  /**
   * Get session history as observable
   */
  public getSessionHistory(): Observable<IFamilyDialogueSessionHistory[]> {
    return this.sessionHistory.asObservable();
  }

  /**
   * Get loading state as observable
   */
  public getLoadingState(): Observable<boolean> {
    return this.isLoading.asObservable();
  }

  /**
   * Load session history
   */
  public async loadSessionHistory(): Promise<void> {
    try {
      this.isLoading.next(true);

      // TODO: Implement Odoo API integration
      // const userId = await this.authService.getUserId();
      // const domain: SearchDomain = [
      //   ['student_id', '=', userId]
      // ];
      //
      // const result = await this.odooService.searchRead(
      //   ModelName.FAMILY_DIALOGUE_SESSION,
      //   domain,
      //   ['id', 'date', 'title', 'description', 'status'],
      //   0,
      //   0,
      //   OrderBy.DATE_DESC
      // );
      //
      // if (result) {
      //   const history: IFamilyDialogueSessionHistory[] = result.map((item: any) => ({
      //     id: item.id,
      //     date: new Date(item.date),
      //     title: item.title,
      //     description: item.description,
      //     status: item.status
      //   }));
      //
      //   this.sessionHistory.next(history);
      // }

      // Mock data for testing
      setTimeout(() => {
        this.sessionHistory.next(ForceTestData.familyDialogueSessions);
        this.isLoading.next(false);
      }, 1000);
    } catch (error) {
      console.error('ERROR:', error);
      this.isLoading.next(false);
    }
  }

  /**
   * Get session detail
   * @param sessionId Session ID
   */
  public async getSessionDetail(sessionId: number): Promise<IFamilyDialogueSessionDetail | null> {
    try {
      // TODO: Implement Odoo API integration
      // const result = await this.odooService.callKw(
      //   ModelName.FAMILY_DIALOGUE_SESSION,
      //   'get_session_detail',
      //   [{ session_id: sessionId }]
      // );
      //
      // if (result) {
      //   return {
      //     id: result.id,
      //     date: new Date(result.date),
      //     title: result.title,
      //     description: result.description,
      //     status: result.status,
      //     questions: result.questions.map((q: any) => ({
      //       id: q.id,
      //       text: q.text,
      //       type: q.type,
      //       answer: q.answer
      //     })),
      //     feedback: result.feedback
      //   };
      // }

      // Mock data for testing
      return new Promise((resolve) => {
        setTimeout(() => {
          const sessionDetail = ForceTestData.getFamilyDialogueSessionDetail(sessionId);
          if (sessionDetail) {
            resolve(sessionDetail);
          } else {
            resolve(null);
          }
        }, 500);
      });
    } catch (error) {
      console.error('ERROR:', error);
      return null;
    }
  }

  /**
   * Submit session answers
   * @param sessionId Session ID
   * @param questions Questions with answers
   */
  public async submitSessionAnswers(sessionId: number, questions: IFamilyDialogueSessionQuestion[]): Promise<boolean> {
    try {
      // TODO: Implement Odoo API integration
      // const result = await this.odooService.callKw(
      //   ModelName.FAMILY_DIALOGUE_SESSION,
      //   'submit_session_answers',
      //   [{
      //     session_id: sessionId,
      //     answers: questions.map(q => ({
      //       question_id: q.id,
      //       answer: q.answer
      //     }))
      //   }]
      // );
      //
      // if (result?.success) {
      //   await this.loadSessionHistory();
      //   return true;
      // }

      // Mock successful submission
      return new Promise((resolve) => {
        setTimeout(() => {
          this.loadSessionHistory();
          resolve(true);
        }, 1000);
      });
    } catch (error) {
      console.error('ERROR:', error);
      return false;
    }
  }
}
