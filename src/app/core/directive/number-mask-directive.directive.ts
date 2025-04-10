import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { CommonConstants } from '../../shared/classes/common-constants';

@Directive({
  selector: '[appNumberMask]',
  standalone: true,
})
export class NumberMaskDirective implements OnInit {
  @Input() appNumberMask: { decimalSeparator?: string; thousandsSeparator?: string; inputmode?: string, hasFormatLabel?: boolean } = {
    decimalSeparator: '.',
    thousandsSeparator: ' ',
    inputmode: 'text',
    hasFormatLabel: false,
  };

  constructor(private el: ElementRef<HTMLInputElement>) {
  }

  ngOnInit() {
    this.onInputChange({target: this.el.nativeElement});
  }

  @HostListener('ionInput', ['$event'])
  onInputChange(event: any) {
    if (this.appNumberMask.inputmode !== 'decimal') return;

    const target = event.target as HTMLInputElement;
    let value = target.value;
    if (!value) return;

    // Cập nhật giá trị của input
    target.value = CommonConstants.formatNumber(value.toString(), this.appNumberMask.decimalSeparator, this.appNumberMask.thousandsSeparator) || '';
  }

  @HostListener('ionFocus', ['$event'])
  onFocusChange(event: any) {
    if (this.appNumberMask.inputmode !== 'decimal') return;

    const target = event.target as HTMLInputElement;
    let value = target.value;
    if (!value) return;

    // Cập nhật giá trị của input
    target.value = CommonConstants.formatNumber(value.toString(), this.appNumberMask.decimalSeparator, this.appNumberMask.thousandsSeparator) || '';
  }
}
