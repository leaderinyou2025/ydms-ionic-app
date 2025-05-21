import { IAssetsResource } from './assets-resource';
import { IDictionary } from '../base/dictionary';

export interface ISoundSettings extends IDictionary<any> {
  enabled?: boolean;
  background?: ISoundSetting,
}

export interface ISoundSetting {
  enabled?: boolean;
  volume?: number;
  sound?: ISoundConfig
}

export interface ISoundConfig extends IAssetsResource {
  volume?: number;
}
