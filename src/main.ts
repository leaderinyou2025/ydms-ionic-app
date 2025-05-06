import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { register } from 'swiper/element/bundle';

import { AppModule } from './app/app.module';

register();
defineCustomElements(window);
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
