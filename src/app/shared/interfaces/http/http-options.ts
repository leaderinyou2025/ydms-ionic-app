import { HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { IDictionary } from '../base/dictionary';

export interface IHttpOptions extends IDictionary<any> {
  headers?: HttpHeaders | any;
  context?: HttpContext;
  params?: HttpParams | any;
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
}
