import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { OdooService, SearchDomain } from '../odoo/odoo.service';
import { ModelName } from '../../shared/enums/model-name';
import { OrderBy } from '../../shared/enums/order-by';
import {
  IConflictLogEntry,
  IConflictLogDetail,
  IConflictLogSolution,
  IConflictLogProgressUpdate,
  ConflictLogStatus,
  IConflictLogFormData
} from '../../shared/interfaces/conflict-log/conflict-log.interfaces';
import { ForceTestData } from '../../shared/classes/force-test-data';

@Injectable({
  providedIn: 'root'
})
export class ConflictLogService {
  private conflictLogs = new BehaviorSubject<IConflictLogEntry[]>([]);
  private currentLog = new BehaviorSubject<IConflictLogDetail | null>(null);

  constructor(
    private authService: AuthService,
    private odooService: OdooService
  ) {
    this.loadConflictLogs();
  }

  /**
   * Get conflict logs as observable
   */
  public getConflictLogs(): Observable<IConflictLogEntry[]> {
    return this.conflictLogs.asObservable();
  }

  /**
   * Get current conflict log as observable
   */
  public getCurrentLog(): Observable<IConflictLogDetail | null> {
    return this.currentLog.asObservable();
  }

  /**
   * Load conflict logs
   */
  private async loadConflictLogs(): Promise<void> {
    try {
      // TODO: Implement Odoo API integration
      // const authData = await this.authService.getAuthData();
      // if (!authData?.id) return;
      //
      // const conflictLogsResult = await this.odooService.searchRead<IConflictLogEntry>(
      //   ModelName.CONFLICT_LOG,
      //   [['user_id', '=', authData.id]],
      //   ['id', 'date', 'title', 'description', 'status', 'progress'],
      //   0,
      //   0,
      //   OrderBy.CREATE_AT_DESC
      // );
      //
      // if (conflictLogsResult?.length) {
      //   this.conflictLogs.next(conflictLogsResult);
      // }

      // Use mock data
      this.conflictLogs.next(ForceTestData.mockConflictLogs);
    } catch (error) {
      console.error('ERROR:', error);
    }
  }

  /**
   * Get conflict log detail by ID
   * @param logId Conflict log ID
   */
  public async getConflictLogDetail(logId: number): Promise<IConflictLogDetail | null> {
    try {
      // TODO: Implement Odoo API integration
      // const logDetailResult = await this.odooService.read<IConflictLogDetail>(
      //   ModelName.CONFLICT_LOG,
      //   [logId],
      //   ['id', 'date', 'title', 'description', 'status', 'progress', 'solutions', 'progressUpdates']
      // );
      //
      // if (logDetailResult?.length) {
      //   const logDetail = logDetailResult[0];
      //   this.currentLog.next(logDetail);
      //   return logDetail;
      // }

      // Use mock data
      const logEntry = ForceTestData.mockConflictLogs.find(item => item.id === logId);
      if (!logEntry) return null;

      const mockLogDetail: IConflictLogDetail = {
        ...logEntry,
        solutions: ForceTestData.mockConflictLogSolutions.filter(solution => solution.id === logId),
        progressUpdates: ForceTestData.mockConflictLogProgressUpdates.filter(update => update.id === logId)
      };

      this.currentLog.next(mockLogDetail);
      return mockLogDetail;
    } catch (error) {
      console.error('ERROR:', error);
      return null;
    }
  }

  /**
   * Create a new conflict log
   * @param formData Conflict log form data
   */
  public async createConflictLog(formData: IConflictLogFormData): Promise<IConflictLogEntry | null> {
    try {
      const authData = await this.authService.getAuthData();
      if (!authData) return null;

      // TODO: Implement Odoo API integration
      // const newLogData: Partial<IConflictLogEntry> = {
      //   title: formData.title,
      //   description: formData.description,
      //   status: ConflictLogStatus.NEW,
      //   progress: 0,
      //   date: new Date(),
      //   user: authData
      // };
      //
      // const newLogId = await this.odooService.create<IConflictLogEntry>(
      //   ModelName.CONFLICT_LOG,
      //   newLogData
      // );
      //
      // if (!newLogId) return null;
      //
      // // If solution is provided, create a solution record
      // if (formData.solution) {
      //   await this.odooService.create<IConflictLogSolution>(
      //     ModelName.CONFLICT_LOG_SOLUTION,
      //     {
      //       description: formData.solution,
      //       date: new Date(),
      //       user: authData,
      //       conflict_log_id: newLogId
      //     }
      //   );
      // }
      //
      // // Reload logs
      // await this.loadConflictLogs();
      // return this.getConflictLogDetail(newLogId);

      // Use mock data
      const newId = Math.max(...ForceTestData.mockConflictLogs.map(log => log.id), 0) + 1;
      const newLog: IConflictLogEntry = {
        id: newId,
        title: formData.title,
        description: formData.description,
        status: ConflictLogStatus.NEW,
        progress: 0,
        date: new Date(),
        user: authData
      };

      // Add to mock data
      ForceTestData.mockConflictLogs.unshift(newLog);
      this.conflictLogs.next([...ForceTestData.mockConflictLogs]);

      // If solution is provided, create a solution record
      if (formData.solution) {
        const newSolution: IConflictLogSolution = {
          id: newId,
          description: formData.solution,
          date: new Date(),
          user: authData
        };
        ForceTestData.mockConflictLogSolutions.push(newSolution);
      }

      return newLog;
    } catch (error) {
      console.error('ERROR:', error);
      return null;
    }
  }

  /**
   * Update conflict log progress
   * @param logId Conflict log ID
   * @param formData Conflict log form data
   */
  public async updateConflictLogProgress(logId: number, formData: IConflictLogFormData): Promise<boolean> {
    try {
      const authData = await this.authService.getAuthData();
      if (!authData) return false;

      // TODO: Implement Odoo API integration
      // // Create progress update
      // await this.odooService.create<IConflictLogProgressUpdate>(
      //   ModelName.CONFLICT_LOG_PROGRESS,
      //   {
      //     description: formData.progressDescription,
      //     progress: formData.progress,
      //     date: new Date(),
      //     user: authData,
      //     conflict_log_id: logId
      //   }
      // );
      //
      // // Update log status and progress
      // await this.odooService.write<IConflictLogEntry>(
      //   ModelName.CONFLICT_LOG,
      //   [logId],
      //   {
      //     progress: formData.progress,
      //     status: formData.progress >= 100 ? ConflictLogStatus.RESOLVED : ConflictLogStatus.IN_PROGRESS
      //   }
      // );
      //
      // // Reload logs
      // await this.loadConflictLogs();
      // return true;

      // Use mock data
      if (!formData.progress || !formData.progressDescription) return false;

      // Create progress update
      const newProgressUpdate: IConflictLogProgressUpdate = {
        id: logId,
        description: formData.progressDescription,
        progress: formData.progress,
        date: new Date(),
        user: authData
      };
      ForceTestData.mockConflictLogProgressUpdates.push(newProgressUpdate);

      // Update log status and progress
      const logIndex = ForceTestData.mockConflictLogs.findIndex(log => log.id === logId);
      if (logIndex === -1) return false;

      ForceTestData.mockConflictLogs[logIndex].progress = formData.progress;
      ForceTestData.mockConflictLogs[logIndex].status = formData.progress >= 100 
        ? ConflictLogStatus.RESOLVED 
        : ConflictLogStatus.IN_PROGRESS;

      this.conflictLogs.next([...ForceTestData.mockConflictLogs]);
      return true;
    } catch (error) {
      console.error('ERROR:', error);
      return false;
    }
  }
}
