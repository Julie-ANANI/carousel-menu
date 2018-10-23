// Modules externes
import { NgModule, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BrowserModule, Title } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CookieModule, CookieService } from 'ngx-cookie';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';

// Modules/Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedLoaderModule } from './modules/shared/components/shared-loader/shared-loader.module';

// Services
import { InnovationService } from './services/innovation/innovation.service';
import { CampaignService } from './services/campaign/campaign.service';
import { DashboardService } from './services/dashboard/dashboard.service';
import { TranslateNotificationsService } from './services/notifications/notifications.service';
import { TranslateTitleService } from './services/title/title.service';
import { UserService } from './services/user/user.service';
import { LoaderService } from './services/loader/loader.service';
import { ShareService } from './services/share/share.service';
import { AutocompleteService } from './services/autocomplete/autocomplete.service';
import { EmailService } from './services/email/email.service';
import { SearchService } from './services/search/search.service';
import { PresetService } from './services/preset/preset.service';
import { AnswerService } from './services/answer/answer.service';
import { ProfessionalsService } from './services/professionals/professionals.service';
import { DownloadService } from './services/download/download.service';
import { TagsService } from './services/tags/tags.service';
import { TemplatesService } from './services/templates/templates.service';
import { TranslationService } from './services/translation/translation.service';
import { FrontendService } from './services/frontend/frontend.service';
import { CurrentRouteService } from './services/frontend/current-route/current-route.service';
import { ListenerService } from './services/frontend/listener/listener.service';
import { LocalStorageService } from './services/localStorage/localStorage.service';

// Resolvers
import { CampaignResolver } from './resolvers/campaign.resolver';
import { InnovationResolver } from './resolvers/innovation.resolver';
import { RequestResolver } from './resolvers/request.resolver';
import { ScenarioResolver } from './resolvers/scenario.resolver';
import { SignatureResolver } from './resolvers/signature.resolver';
import { PresetResolver } from './resolvers/preset.resolver';

// Interceptors
import { ApiUrlInterceptor } from './interceptors/apiUrl.interceptor';
import { LoaderBrowserInterceptor } from './interceptors/loader.interceptor';
import { SessionInterceptor } from './interceptors/session.interceptor';

@NgModule({
  imports: [
    BrowserModule.withServerTransition({
      appId: 'umi-application-front'
    }),
    HttpClientModule,
    AppRoutingModule,
    SimpleNotificationsModule.forRoot(),
    BrowserAnimationsModule,
    SharedLoaderModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (CreateTranslateLoader)
      }
    }),
    Ng2AutoCompleteModule,
    // Angular2FontawesomeModule,
    CookieModule.forRoot()
  ],
  declarations: [
    AppComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ApiUrlInterceptor, multi: true, },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderBrowserInterceptor, multi: true, },
    { provide: HTTP_INTERCEPTORS, useClass: SessionInterceptor, multi: true, },
    Title,
    UserService,
    InnovationService,
    CampaignService,
    LoaderService,
    DashboardService,
    EmailService,
    ShareService,
    SearchService,
    PresetService,
    AnswerService,
    ProfessionalsService,
    DownloadService,
    TemplatesService,
    AutocompleteService,
    TranslateNotificationsService,
    TranslateTitleService,
    CampaignResolver,
    InnovationResolver,
    RequestResolver,
    ScenarioResolver,
    SignatureResolver,
    RequestResolver,
    PresetResolver,
    TranslationService,
    TagsService,
    FrontendService,
    CurrentRouteService,
    ListenerService,
    LocalStorageService
  ],
  bootstrap: [AppComponent]
})

export class AppModule {

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              private _translateService: TranslateService,
              private _cookieService: CookieService) {

    this._translateService.addLangs(['en', 'fr']);
    this._translateService.setDefaultLang('en');

    const user_lang = this._cookieService.get('user_lang');
    if (isPlatformBrowser(platformId)) {
      let browserLang = user_lang || this._translateService.getBrowserLang();
      if (!browserLang.match(/en|fr/)) {
        browserLang = 'en';
      }
      this._cookieService.put('user_lang', browserLang);
      this._translateService.use(browserLang);
    } else {
      this._translateService.use(user_lang || 'en');
    }
  }

}

export function CreateTranslateLoader() {
  return new TranslateUniversalLoader();
}

export class TranslateUniversalLoader implements TranslateLoader {
  public getTranslation(_: string): Observable<any> {
    return Observable.create((observer: any) => {
      observer.next();
      observer.complete();
    });
  }
}
