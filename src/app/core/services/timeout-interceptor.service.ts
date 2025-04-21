import { Inject, Injectable, InjectionToken } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

export const DEFAULT_TIMEOUT = new InjectionToken<number>('defaultTimeout');

@Injectable()
export class TimeoutInterceptorService implements HttpInterceptor {

  constructor(@Inject(DEFAULT_TIMEOUT) protected defaultTimeout: number) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const timeoutHeader = req.headers.get('timeout');
    const timeoutValue = timeoutHeader !== null ? Number(timeoutHeader) : this.defaultTimeout;
    const finalTimeout = isNaN(timeoutValue) || timeoutValue <= 0 ? this.defaultTimeout : timeoutValue;
    return next.handle(req).pipe(timeout(finalTimeout));
  }
}
