import { ILiyYdmsAssetsResource } from '../models/liy-ydms-assets-resource';
import { IDictionary } from '../base/dictionary';

export interface ISoundSettings extends IDictionary<any> {
  background?: ISoundSetting,
  touch?: ISoundSetting,
  reload?: ISoundSetting,
  loading?: ISoundSetting,
  notification?: ISoundSetting,
  message?: ISoundSetting,
  success?: ISoundSetting,
  failed?: ISoundSetting
}

export interface ISoundSetting {
  enabled?: boolean;
  volume?: number;
  sound?: ISoundConfig
}

export interface ISoundConfig extends ILiyYdmsAssetsResource {
  volume?: number;
}
