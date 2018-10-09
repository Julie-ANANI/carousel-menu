import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';

import { CookieService, CookieBackendService } from 'ngx-cookie';
import { CookieServerInterceptor } from './interceptors/cookie-server.interceptor';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
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
  ],
  bootstrap: [ AppComponent ],
})
export class AppServerModule {}
