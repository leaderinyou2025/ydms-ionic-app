import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { formatDate } from '@angular/common';
import { ModalController, Platform } from '@ionic/angular';
import { v4 as uuidv4 } from 'uuid';
import { DatePicker, DatePickerOptions } from '@capacitor-community/date-picker';
import { StorageKey } from '../../enums/storage-key';
import { LocalStorageService } from '../../../services/local-storage/local-storage.service';
import { LanguageKeys } from '../../enums/language-keys';

@Component({
  selector: 'app-select-datetime',
  templateUrl: './select-datetime.component.html',
  styleUrls: ['./select-datetime.component.scss'],
  standalone: false
})
export class SelectDatetimeComponent implements OnInit {
  @Input() label: string | undefined;
  @Input() placeholder: string | undefined;
  @Input() required: boolean | undefined;
  @Input() default: string | boolean | Array<string> | any;
  @Input() id: string | undefined;
  @Input() minYear: number | undefined;
  @Input() minDate: string | undefined;
  @Input() maxYear: number | undefined;
  @Input() maxDate: string | undefined;
  @Input() showClearButton: boolean | undefined;
  @Input() format: string | undefined;
  @Input() presentationType: string | undefined;
  @Input() classList: string | undefined;
  @Input() isSetMinDate: boolean | undefined;
  @Input() disabled: boolean | undefined;
  @Output() selectedDatetime = new EventEmitter<string | Array<string> | null>();
  defaultStr: string | null | undefined;
  localStr: string;

  constructor(
    public modalController: ModalController,
    public platform: Platform,
    private localStorageService: LocalStorageService,
  ) {
    const lang = this.localStorageService.get<LanguageKeys>(StorageKey.LANGUAGE) || LanguageKeys.VN;
    this.localStr = lang === LanguageKeys.VN ? 'vi-VN' : 'en-US';
  }

  ngOnInit() {
    if (!this.presentationType) this.presentationType = 'date';
    if (!this.minYear) this.minYear = new Date().getFullYear() - 100;
    if (!this.maxYear) this.maxYear = new Date().getFullYear() + 100;
    if (this.showClearButton == undefined) this.showClearButton = true;

    if (this.default == undefined) {
      this.default = formatDate(new Date(), 'yyyy-MM-dd', 'en').toString();
      this.selectedDatetime.emit(this.default || undefined);
    } else if (this.default == false) {
      this.default = undefined;
    }

    if (!this.id) this.id = uuidv4();
    if (this.format == undefined) this.format = 'dd/MM/yyyy';
    this.defaultStr = this.default ? formatDate(this.default.toString(), this.format, 'en').toString() : null;
  }

  onClickSelectDateTime() {
    if (this.disabled) return;
    const dateOption: DatePickerOptions = {
      mode: 'date',
      locale: this.localStr,
      doneText: 'Chọn',
      cancelText: 'Huỷ bỏ',
      android: {
        theme: 'dark',
        doneText: 'Chọn',
        cancelText: 'Huỷ bỏ'
      },
      ios: {
        theme: 'dark',
        style: 'inline',
        doneText: 'Chọn',
        cancelText: 'Huỷ bỏ'
      },
    };

    if (this.minDate) dateOption.min = new Date(this.minDate.toString()).toISOString();
    if (this.maxDate) dateOption.max = new Date(this.maxDate.toString()).toISOString();
    if (this.default) dateOption.date = new Date(this.default.toString()).toISOString();

    DatePicker.present(dateOption).then((result: any) => this.onSelectedDatetime(result?.value, null));
  }

  onSelectedDatetime(value: string | Array<string> | null | undefined, event: any) {
    this.default = value;

    if (!event && !value) {
      this.defaultStr = null;
      this.selectedDatetime.emit(value);
      return;
    }

    if (this.format == undefined) this.format = 'dd/MM/yyyy';
    this.defaultStr = this.default ? formatDate(this.default?.toString(), this.format, 'en').toString() : null;
    this.selectedDatetime.emit(value ? formatDate(value.toString(), 'yyyy-MM-dd', 'en').toString() : undefined);

    if (!event?.target?.classList?.contains('month-year-picker-open')) {
      this.closeDatetimeGrid();
    }
  }

  onClickOutOfDatetimeGrid(event: any) {
    if (event?.target?.classList?.contains('datetime-grid')) {
      return;
    } else {
      this.closeDatetimeGrid();
    }
  }

  private closeDatetimeGrid() {
    this.modalController.getTop().then(popover => {
      if (popover) {
        const classList: DOMTokenList = popover?.classList;
        if (classList?.contains('select-date-modal')) this.modalController.dismiss();
      }
    });
  }

}
