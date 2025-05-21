import { Theme } from '../../enums/theme';
import { TextZoomSize } from '../../enums/text-zoom-size';
import { IAssetsResource } from './assets-resource';
import { IRelatedField } from '../base/related-field';

export interface IThemeSettings {
  theme_model?: Theme,
  text_size?: TextZoomSize,
  avatar?: IRelatedField,
  background?: IAssetsResource,
}
