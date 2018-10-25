import { NgModule } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';

import { CookieService, CookieBackendService } from 'ngx-cookie';
import { CookieServerInterceptor } from './interceptors/cookie-server.interceptor';
import { LocalStorageBackendService } from './services/localStorage/localStorageBackend.service';
import { LocalStorageService } from './services/localStorage/localStorage.service';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ServerTransferStateModule,
    ModuleMapLoaderModule
  ],
  providers: [
    // Add universal-only providers here
    { provide: CookieService, useClass: CookieBackendService },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CookieServerInterceptor,
      multi: true,
    },
    { provide: LocalStorageService, useClass: LocalStorageBackendService },
  ],
  bootstrap: [ AppComponent ],
})
export class AppServerModule {}
