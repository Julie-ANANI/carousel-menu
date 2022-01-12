import {environment} from './environments/environment';
import {enableProdMode} from '@angular/core';

export { AppServerModule } from './app/app.server.module';

if (environment.production) {
  enableProdMode();
}

export { renderModule, renderModuleFactory } from '@angular/platform-server';