// Modules externes
import { NgModule, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CookieModule, CookieService } from 'ngx-cookie';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

// Modules/Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotFoundModule } from './modules/common/not-found/not-found.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Services
import { LocalStorageService } from './services/localStorage/localStorage.service';
import { TranslationService } from "./services/translation/translation.service";
import { TranslateTitleService } from './services/title/title.service';
import { TranslateNotificationsService } from './services/notifications/notifications.service';
import { LoaderService } from './services/loader/loader.service';
import { MouseService } from './services/mouse/mouse.service';

// Interceptors
import { ApiUrlInterceptor } from './interceptors/apiUrl.interceptor';
import { LoaderBrowserInterceptor } from './interceptors/loader.interceptor';
import { SessionInterceptor } from './interceptors/session.interceptor';

@NgModule({
  imports: [
    NotFoundModule,
    BrowserTransferStateModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SimpleNotificationsModule.forRoot(),
    CookieModule.forRoot(),
    BrowserModule.withServerTransition({
      appId: 'umi-application-front'
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (CreateTranslateLoader)
      }
    })
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    LocalStorageService,
    TranslationService,
    TranslateTitleService,
    TranslateNotificationsService,
    MouseService,
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: ApiUrlInterceptor, multi: true, },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderBrowserInterceptor, multi: true, },
    { provide: HTTP_INTERCEPTORS, useClass: SessionInterceptor, multi: true, }
  ],
  bootstrap: [
    AppComponent
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
    return Observable.create((observer: any) => {
      observer.next();
      observer.complete();
    });
  }
}
