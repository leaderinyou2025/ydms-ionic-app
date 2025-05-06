import { Theme } from '../../enums/theme';
import { TextZoomSize } from '../../enums/text-zoom-size';
import { ILiyYdmsAssetsResource } from '../models/liy-ydms-assets-resource';

export interface IThemeSettings {
  theme_model: Theme,
  text_size: TextZoomSize,
  avatar: ILiyYdmsAssetsResource,
  background: ILiyYdmsAssetsResource,
}
