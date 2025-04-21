import { DatePipe } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';

import { IBase } from '../interfaces/base/base';

export class CommonConstants {

  public static randomHexColor(): string {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return '#' + randomColor;
  }

  public static normalize(str: string) {
    if (!str) return;
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
  }

  public static validURL(str: string): boolean {
    let pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return pattern.test(str);
  }

  public static mergeArrayObjectById<T extends IBase>(oldArrObj: Array<T>, newArrObj: Array<T>): Array<T> | undefined {
    if (!oldArrObj || oldArrObj?.length == 0) return newArrObj;

    if (!newArrObj || newArrObj?.length == 0) return oldArrObj;

    const objsFiltered = oldArrObj.filter((el) => {
      return !newArrObj.find(u => u.id == el.id);
    });

    if (!objsFiltered || objsFiltered?.length == 0) return newArrObj;

    return newArrObj.concat(objsFiltered || []);
  }

  public static convertArr2ListItem(data: Array<any>): Array<any> {
    const result = data?.length ? [...data] : [];
    let datePipe = new DatePipe('vi-VN');

    for (let item of result) {
      for (let key in item) {
        if (item[key] == false || item[key] == 'false' || item[key] == 'False') {
          item[key] = key.includes('_ids') ? [] : null;
          continue;
        }

        if (typeof item[key]?.[0] == 'number' && typeof item[key]?.[1] == 'string') {
          item[key] = {id: item[key][0], name: item[key][1]};
          continue;
        }

        if (key == 'create_date' || key == 'write_date') {
          let time = datePipe.transform(((item[key].replace(' ', 'T')) + '.000Z'), 'HH:mm');
          item[key] = datePipe.transform(((item[key].replace(' ', 'T')) + '.000Z'), 'yyyy-MM-dd');
          item[key.replace('date', 'time')] = time;
        }
      }
    }
    return result;
  }

  public static convertListItem2Number<T>(data: any): T {
    const result = {...data};

    for (let key in result) {
      if (typeof result[key] == 'object' && result[key]?.id && result[key]?.name) result[key] = +result[key]?.id;
      if (typeof result[key] == 'object' && result[key]?.id === null && result[key]?.name === null) result[key] = null;
      if (key == 'create_date' || key == 'create_time' || key == 'write_date' || key == 'write_time') delete result[key];
    }
    return result;
  }

  public static getRequestHeader(): HttpHeaders {
    return new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    });
  };

  public static formatNumber(value: string, decimalSeparator: string = '.', thousandsSeparator: string = ' '): string | undefined {

    let sign: -1 | 1;
    if (value[0] === '-') {
      sign = -1;
    } else {
      sign = 1;
    }

    // Loại bỏ các ký tự không phải số (trừ dấu chấm hoặc dấu phẩy)
    value = value.replace(/(?!^)[^\d.,]/g, '');
    value = value.replaceAll(thousandsSeparator, '');

    if (decimalSeparator !== '.') value = value.replace(decimalSeparator, '.');
    value = value.replace(',', '.');

    // Tách phần nguyên và phần thập phân (nếu có)
    const [integerPart, decimalPart] = value.split(decimalSeparator);

    // Định dạng phần nguyên với dấu phân cách hàng nghìn
    let formattedInteger = '';
    for (let i = integerPart.length - 1, count = 0; i >= 0; i--, count++) {
      formattedInteger = integerPart.charAt(i) + formattedInteger;
      if (count % 3 === 2 && i > 0) {
        formattedInteger = thousandsSeparator + formattedInteger;
      }
    }

    // Kết hợp lại phần nguyên và phần thập phân (nếu có)
    let formattedValue = formattedInteger;
    if (decimalPart !== undefined) {
      formattedValue += decimalSeparator + decimalPart;
    }

    if (!formattedValue) return;

    return (sign === -1 ? '-' : '') + formattedValue;
  }

  public static getKeys<T extends object>(): (keyof T)[] {
    return Object.keys({} as T) as (keyof T)[];
  }

  public static randomString(length: number) {
    const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
  }
}
