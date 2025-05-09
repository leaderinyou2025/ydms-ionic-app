import { StatusItemType } from '../../enums/home/status-item-type.enum';

/**
 * Interface for status bar items
 */
export interface IStatusItem {
  type: StatusItemType;
  value: number | string;
  label: string;
}

/**
 * Interface for task items
 */
export interface ITask {
  id: number;
  description: string;
  points: number;
}

/**
 * Interface for character information
 */
export interface ICharacter {
  name: string;
  imagePath: string;
  altText?: string;
}

/**
 * Interface for welcome message
 */
export interface IWelcomeMessage {
  title: string;
  subtitle: string;
}

/**
 * Interface for progress information
 */
export interface IProgress {
  completed: number;
  total: number;
  value: number;
}

