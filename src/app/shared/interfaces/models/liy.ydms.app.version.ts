import { IBase } from '../base/base';
import { NativePlatform } from '../../enums/native-platform';

/**
 * Model: Live update app version
 */
export interface ILiyYdmsAppVersion extends IBase {
  platform: NativePlatform.IOS | NativePlatform.ANDROID;
  version_build: string;
  version_code: string;
  public_url?: string;
}
