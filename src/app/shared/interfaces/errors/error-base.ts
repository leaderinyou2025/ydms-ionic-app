import { IDictionary } from '../base/dictionary';

export interface IErrorBase extends IDictionary<any> {
  message: string;
}
