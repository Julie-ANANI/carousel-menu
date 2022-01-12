import { NgModule } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { CookieServerInterceptor } from './interceptors/cookie-server.interceptor';
import { ErrorService } from './services/error/error.service';
import { ErrorBackendService } from './services/error/errorBackend.service';
import { LocalStorageBackendService } from './services/localStorage/localStorageBackend.service';
import { LocalStorageService } from '@umius/umi-common-component/services/localStorage';
import { SocketService } from './services/socket/socket.service';
import { SocketSsrService } from './services/socket/socket-ssr.service';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import {EtherpadSocketService} from './services/socket/etherpad.socket.service';
import {EtherpadSocketSsrService} from './services/socket/etherpad.socket-ssr.service';
import { CookieBackendModule } from 'ngx-cookie-backend';

@NgModule({
  imports: [
    // The AppServerModule should import your AppModule followed
    // by the ServerModule from @angular/platform-server.
    AppModule,
    ServerModule,
    ServerTransferStateModule,
    CookieBackendModule.forRoot()
  ],
  providers: [
    // Add universal-only providers here
    { provide: HTTP_INTERCEPTORS, useClass: CookieServerInterceptor, multi: true },
    { provide: LocalStorageService, useClass: LocalStorageBackendService },
    { provide: SocketService, useClass: SocketSsrService },
    { provide: EtherpadSocketService, useClass: EtherpadSocketSsrService },
    { provide: ErrorService, useClass: ErrorBackendService }
  ],
  // Since the bootstrapped component is not inherited from your
  // imported AppModule, it needs to be repeated here.
  bootstrap: [ AppComponent ],
})
export class AppServerModule {}
