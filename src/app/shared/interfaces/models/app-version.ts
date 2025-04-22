import { IBase } from '../base/base';

export interface IAppVersion extends IBase {
  bundle_id?: string;
  platform: 'android' | 'ios';
  version_build: string;
  version_code: string;
  bundle_file?: string;
  active?: boolean;
}
