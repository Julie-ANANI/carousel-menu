import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';

import { CookieService, CookieBackendService } from 'ngx-cookie';

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
    { provide: CookieService, useClass: CookieBackendService }
  ],
  bootstrap: [ AppComponent ],
})
export class AppServerModule {}
