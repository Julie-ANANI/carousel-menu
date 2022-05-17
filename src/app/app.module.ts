// Modules externes
import { NgModule, PLATFORM_ID, Inject, ErrorHandler } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {BrowserModule, BrowserTransferStateModule, Meta} from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CookieModule, CookieService } from 'ngx-cookie';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

// Modules/Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotFoundModule } from './modules/errors/not-found/not-found.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SpinnerLoaderModule } from './modules/utility/spinner-loader/spinner-loader.module';

// Interceptors
import { ApiUrlInterceptor } from './interceptors/apiUrl.interceptor';
import { GlobalErrorHandler } from './handlers/error-handler';
import { LoaderBrowserInterceptor } from './interceptors/loader.interceptor';
import { SessionInterceptor } from './interceptors/session.interceptor';
import {CachingInterceptor} from './interceptors/caching.interceptor';
import {EtherpadInterceptor} from "./interceptors/etherpad.interceptor";
import { MenuKebabModule } from "./modules/utility/menu-kebab/menu-kebab.module";

@NgModule({
    imports: [
        NotFoundModule,
        BrowserTransferStateModule,
        HttpClientModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        SimpleNotificationsModule.forRoot(),
        CookieModule.forRoot(),
        SpinnerLoaderModule,
        BrowserModule.withServerTransition({
            appId: 'umi-application-front'
        }),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (CreateTranslateLoader)
            }
        }),
        MenuKebabModule
    ],
  declarations: [
    AppComponent
  ],
  bootstrap: [
    AppComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ApiUrlInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderBrowserInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: SessionInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: EtherpadInterceptor, multi: true },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    Meta
  ]
})

export class AppModule {

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              private translateService: TranslateService,
              private cookieService: CookieService) {

    this.translateService.addLangs(['en', 'fr']);
    this.translateService.setDefaultLang('en');
    const user_lang = this.cookieService.get('user_lang');

    if (isPlatformBrowser(platformId)) {
      let browserLang = user_lang || this.translateService.getBrowserLang();
      if (!browserLang.match(/en|fr/)) {
        browserLang = 'en';
      }
      this.cookieService.put('user_lang', browserLang);
      this.translateService.use(browserLang);
    } else {
      this.translateService.use(user_lang || 'en');
    }
  }

}

export function CreateTranslateLoader() {
  return new TranslateUniversalLoader();
}

export class TranslateUniversalLoader implements TranslateLoader {
  getTranslation(_: string): Observable<any> {
    return new Observable((observer: any) => {
      observer.next();
      observer.complete();
    });
  }
}
