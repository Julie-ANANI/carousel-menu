import { NgModule } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';

import { CookieService, CookieBackendService } from 'ngx-cookie';
import { CookieServerInterceptor } from './interceptors/cookie-server.interceptor';
import { ErrorService } from './services/error/error.service';
import { ErrorBackendService } from './services/error/errorBackend.service';
import { LocalStorageBackendService } from './services/localStorage/localStorageBackend.service';
import { LocalStorageService } from './services/localStorage/localStorage.service';
import { SocketService } from './services/socket/socket.service';
import { SocketSsrService } from './services/socket/socket-ssr.service';

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
    { provide: CookieService, useClass: CookieBackendService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: CookieServerInterceptor, multi: true },
    { provide: ErrorService, useClass: ErrorBackendService, multi: true },
    { provide: LocalStorageService, useClass: LocalStorageBackendService, multi: true },
    { provide: SocketService, useClass: SocketSsrService, multi: true },
  ],
  bootstrap: [ AppComponent ],
})
export class AppServerModule {}
