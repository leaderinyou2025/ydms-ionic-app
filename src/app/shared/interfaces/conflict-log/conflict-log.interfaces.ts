import { IBase } from '../base/base';
import { IAuthData } from '../auth/auth-data';

/**
 * Interface for conflict log entry
 */
export interface IConflictLogEntry extends IBase {
  date: Date;
  title: string;
  description: string;
  status: ConflictLogStatus;
  progress: number;
  user: IAuthData;
}

/**
 * Interface for conflict log detail
 */
export interface IConflictLogDetail extends IConflictLogEntry {
  solutions: IConflictLogSolution[];
  progressUpdates: IConflictLogProgressUpdate[];
}

/**
 * Interface for conflict log solution
 */
export interface IConflictLogSolution {
  id: number;
  description: string;
  date: Date;
  user: IAuthData;
}

/**
 * Interface for conflict log progress update
 */
export interface IConflictLogProgressUpdate {
  id: number;
  description: string;
  progress: number;
  date: Date;
  user: IAuthData;
}

/**
 * Enum for conflict log status
 */
export enum ConflictLogStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved'
}

/**
 * Interface for conflict log form data
 */
export interface IConflictLogFormData {
  title: string;
  description: string;
  solution?: string;
  progress?: number;
  progressDescription?: string;
  relatedLogId?: number;
}
