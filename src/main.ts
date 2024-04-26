import { AppModule } from './app/app.module';
import { enableProdMode } from '@angular/core';
import { environment } from '@env/environment';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

const production = environment.production ? true : false;

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
