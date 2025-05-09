/**
 * Interface for task details
 */

export interface ITaskDetail {
  id: number;
  name: string;
  questions: Questions[];
}

export interface Questions {
  text: string;
  options: Array<{
    text: string;
    selected: boolean;
  }>;
}
