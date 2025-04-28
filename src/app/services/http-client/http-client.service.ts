import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { catchError, lastValueFrom, Observable, retry, throwError, timeout, timer } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { IHttpOptions } from '../../shared/interfaces/http/http-options';
import { DEFAULT_TIMEOUT } from '../../core/services/timeout-interceptor.service';
import { NetworkService } from '../network/network.service';
import { TranslateKeys } from '../../shared/enums/translate-keys';
import { HttpClientMethods } from '../../shared/enums/http-client-methods';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {
  constructor(
    private httpClient: HttpClient,
    private alertController: AlertController,
    private translate: TranslateService,
    private networkService: NetworkService,
    @Inject(DEFAULT_TIMEOUT) private defaultTimeout: number,
  ) {
  }

  /**
   * get
   * @param url
   * @param httpOptions
   * @param options
   */
  public async get<T = any>(
    url: string,
    httpOptions?: IHttpOptions,
    options?: { operation?: string; showAlert?: boolean; timeoutMs?: number; retryTimes?: number }
  ): Promise<T> {
    return this.handleRequest<T>(HttpClientMethods.GET, url, null, httpOptions, options);
  }

  /**
   * post
   * @param url
   * @param data
   * @param httpOptions
   * @param options
   */
  public async post<T = any>(
    url: string,
    data: any,
    httpOptions?: IHttpOptions,
    options?: { operation?: string; showAlert?: boolean; timeoutMs?: number; retryTimes?: number }
  ): Promise<T> {
    return this.handleRequest<T>(HttpClientMethods.POST, url, data, httpOptions, options);
  }

  /**
   * put
   * @param url
   * @param data
   * @param httpOptions
   * @param options
   */
  public async put<T = any>(
    url: string,
    data: any,
    httpOptions?: IHttpOptions,
    options?: { operation?: string; showAlert?: boolean; timeoutMs?: number; retryTimes?: number }
  ): Promise<T> {
    return this.handleRequest<T>(HttpClientMethods.PUT, url, data, httpOptions, options);
  }

  /**
   * delete
   * @param url
   * @param httpOptions
   * @param options
   */
  public async delete<T = any>(
    url: string,
    httpOptions?: IHttpOptions,
    options?: { operation?: string; showAlert?: boolean; timeoutMs?: number; retryTimes?: number }
  ): Promise<T> {
    return this.handleRequest<T>(HttpClientMethods.DELETE, url, null, httpOptions, options);
  }


  /**
   * Core handler method
   * @param method
   * @param url
   * @param data
   * @param httpOptions
   * @param options
   * @private
   */
  private async handleRequest<T>(
    method: HttpClientMethods,
    url: string,
    data?: any,
    httpOptions?: IHttpOptions,
    options?: { operation?: string; showAlert?: boolean; timeoutMs?: number; retryTimes?: number }
  ): Promise<T> {
    const {operation = method, showAlert = true, timeoutMs = 10000, retryTimes = 0} = options || {};

    let request$: Observable<any>;

    switch (method) {
      case HttpClientMethods.GET:
        request$ = this.httpClient.get<T>(url, httpOptions);
        break;
      case HttpClientMethods.POST:
        request$ = this.httpClient.post<T>(url, data, httpOptions);
        break;
      case HttpClientMethods.PUT:
        request$ = this.httpClient.put<T>(url, data, httpOptions);
        break;
      case HttpClientMethods.PATCH:
        request$ = this.httpClient.patch<T>(url, data, httpOptions);
        break;
      case HttpClientMethods.DELETE:
        request$ = this.httpClient.delete<T>(url, httpOptions);
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }

    request$ = request$.pipe(
      timeout(timeoutMs || this.defaultTimeout),
      retry({
        count: retryTimes,
        delay: (_error, retryCount) => {
          const delayMs = Math.pow(2, retryCount) * 1000;
          console.log(`Retrying attempt ${retryCount}, waiting ${delayMs}ms`);
          return timer(delayMs);
        }
      }),
      catchError(err => this.handleError<T>(operation, showAlert)(err))
    );

    return lastValueFrom(request$);
  }

  /**
   * Error handler
   * @param operation
   * @param showAlert
   * @private
   */
  private handleError<T>(operation = 'operation', showAlert = true) {
    return (error: HttpErrorResponse): Observable<T> => {
      let errorMessage = '';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = error?.error?.message || error?.message;
      } else {
        // Server-side error
        switch (error.status) {
          case 0:
            if (!this.networkService.isOnline()) {
              errorMessage = this.translate.instant(TranslateKeys.ERROR_NETWORK);
            } else {
              errorMessage = this.translate.instant(TranslateKeys.ERROR_SERVER_CONNECTION);
            }
            break;
          case 400:
            errorMessage = this.translate.instant(TranslateKeys.ERROR_BAD_REQUEST);
            break;
          case 401:
            errorMessage = this.translate.instant(TranslateKeys.ERROR_UNAUTHORIZED);
            break;
          case 403:
            errorMessage = this.translate.instant(TranslateKeys.ERROR_FORBIDDEN);
            break;
          case 404:
            errorMessage = this.translate.instant(TranslateKeys.ERROR_NOT_FOUND);
            break;
          case 500:
            errorMessage = this.translate.instant(TranslateKeys.ERROR_SERVER);
            break;
          default:
            errorMessage = error.message || this.translate.instant(TranslateKeys.ERROR_UNKNOWN);
            break;
        }
      }

      console.error(`[${operation}] failed:`, errorMessage, error);

      if (showAlert) {
        this.alertController.create({
          header: this.translate.instant(TranslateKeys.ALERT_ERROR_SYSTEM_HEADER),
          message: errorMessage,
          buttons: [this.translate.instant(TranslateKeys.BUTTON_CLOSE)],
        }).then(alert => alert.present());
      }

      return throwError(() => error);
    };
  }
}
