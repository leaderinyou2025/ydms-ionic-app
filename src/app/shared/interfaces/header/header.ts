import { InputTypes } from '../../enums/input-types';
import { IonicColors } from '../../enums/ionic-colors';
import { TranslateKeys } from '../../enums/translate-keys';
import { AnimationOptions } from 'ngx-lottie';

export interface IHeaderSearchbar {
  type?: InputTypes;
  inputmode?: InputTypes;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  searchIcon?: string;
  showCancelButton?: boolean;
  cancelButtonText?: string;
  cancelButtonIcon?: string;
  showClearButton?: boolean;
  clearIcon?: string;
  maxlength?: number;
  minlength?: number;
  debounce?: number;
  animated?: boolean;
}

export interface IHeaderSegment {
  color?: IonicColors;
  disabled?: boolean;
  scrollable?: boolean;
  value?: number | string;
  buttons: Array<IHeaderSegmentButton>;
}

export interface IHeaderSegmentButton {
  value: number | string;
  label?: TranslateKeys;
  icon?: string;
  iconColor?: IonicColors;
  layout?: 'icon-bottom' | 'icon-end' | 'icon-hide' | 'icon-start' | 'icon-top' | 'label-hide';
  type?: 'button' | 'reset' | 'submit';
  disabled?: boolean;
}

export interface IHeaderAnimeImage {
  imageUrl: string;
  height: string;
  width: string;
  name?: string;
  position?: IHeaderPosition;
}

export interface IHeaderAnimation {
  animation: AnimationOptions;
  width: string;
  height: string;
  position?: IHeaderPosition;
  name?: string;
}

export interface IHeaderPosition {
  position?: 'absolute' | 'relative' | 'fixed';
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
}
