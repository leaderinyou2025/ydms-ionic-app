import { IDictionary } from '../base/dictionary';

export interface IKwArgs {
  offset?: number;
  limit?: number;
  order?: string;
  fields?: Array<string>
  context?: IDictionary<string>
}
