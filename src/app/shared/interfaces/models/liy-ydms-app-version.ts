import { IBase } from '../base/base';
import { NativePlatform } from '../../enums/native-platform';

export interface ILiyYdmsAppVersion extends IBase {
  bundle_id?: string;
  platform: NativePlatform.IOS | NativePlatform.ANDROID;
  version_build: string;
  version_code: string;
  bundle_file?: string;
  active?: boolean;
}
