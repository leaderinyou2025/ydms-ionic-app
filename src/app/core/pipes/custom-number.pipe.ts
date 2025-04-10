import { Pipe, PipeTransform } from '@angular/core';
import { CommonConstants } from '../../shared/classes/common-constants';

@Pipe({
  name: 'customNumber',
  standalone: false
})
export class CustomNumberPipe implements PipeTransform {
  transform(value: number): string | undefined {
    if (value == undefined) return '';
    return CommonConstants.formatNumber(value.toString());
  }
}
