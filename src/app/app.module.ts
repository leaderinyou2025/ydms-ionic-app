import { NgModule, enableProdMode, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import localeVi from '@angular/common/locales/vi';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DEFAULT_TIMEOUT, TimeoutInterceptorService } from './core/services/timeout-interceptor.service';
import { defaultAnimation } from './core/animations/default.animaton';

registerLocaleData(localeVi);
enableProdMode();

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json?cb=' + new Date().getTime());
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot({navAnimation: defaultAnimation, innerHTMLTemplatesEnabled: true, mode: 'ios'}),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    provideHttpClient(withInterceptorsFromDi()),
    {provide: LOCALE_ID, useValue: 'vi-VN'},
    [{provide: HTTP_INTERCEPTORS, useClass: TimeoutInterceptorService, multi: true}],
    [{provide: DEFAULT_TIMEOUT, useValue: 60000}]
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
