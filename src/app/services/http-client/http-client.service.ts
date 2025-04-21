import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AlertController } from '@ionic/angular';
import { catchError, lastValueFrom, Observable, of } from 'rxjs';
import { timeout } from 'rxjs/operators';

import { IHttpOptions } from '../../shared/interfaces/http/http-options';
import { DEFAULT_TIMEOUT } from '../../core/services/timeout-interceptor.service';


@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  constructor(
    private httpClient: HttpClient,
    private alertController: AlertController,
    @Inject(DEFAULT_TIMEOUT) private defaultTimeout: number
  ) {
  }

  /**
   * CALL API BY GET METHOD
   *
   * @param url
   * @param httpOptions
   * @param operation
   * @param timeoutMs
   */
  public get(url: string, httpOptions?: IHttpOptions, operation?: string, timeoutMs: number = 10000): Promise<any> {
    const results = this.httpClient.get<any>(url, httpOptions).pipe(
      timeout(timeoutMs || this.defaultTimeout || 10000),
      catchError(this.handleError<any>(operation))
    );
    return lastValueFrom<any>(results);
  }

  /**
   * CALL API BY POST METHOD
   *
   * @param url
   * @param data
   * @param httpOptions
   * @param operation
   * @param timeoutMs
   */
  public post(url: string, data: any, httpOptions?: IHttpOptions, operation?: string, timeoutMs: number = 10000): Promise<any> {
    const results = this.httpClient.post<any>(url, data, httpOptions).pipe(
      timeout(timeoutMs || this.defaultTimeout || 10000),
      catchError(this.handleError<any>(operation))
    );
    return lastValueFrom<any>(results);
  }

  /**
   * CALL API BY PUT METHOD
   *
   * @param url
   * @param data
   * @param httpOptions
   * @param operation
   * @param timeoutMs
   */
  public put(url: string, data: any, httpOptions?: IHttpOptions, operation?: string, timeoutMs: number = 10000): Promise<any> {
    const results = this.httpClient.put<any>(url, data, httpOptions).pipe(
      timeout(timeoutMs || this.defaultTimeout || 10000),
      catchError(this.handleError<any>(operation))
    );
    return lastValueFrom<any>(results);
  }

  /**
   * CALL API BY DELETE METHOD
   *
   * @param url
   * @param httpOptions
   * @param operation
   * @param timeoutMs
   */
  public delete(url: string, httpOptions?: IHttpOptions, operation?: string, timeoutMs: number = 10000): Promise<any> {
    const results = this.httpClient.delete<any>(url, httpOptions).pipe(
      timeout(timeoutMs || this.defaultTimeout || 10000),
      catchError(this.handleError<any>(operation))
    );
    return lastValueFrom<any>(results);
  }

  /**
   * handleError
   *
   * @param operation
   * @param result
   * @private
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      let errorMsg = error.error ? error.error.message : error.message;
      if (errorMsg && errorMsg.length > 0) {
        this.alertController.create({
          header: 'Thông báo',
          message: errorMsg
        }).then(alert => alert.present());
      }
      return of(result as T);
    };
  }
}
