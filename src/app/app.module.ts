// Modules externes
import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { HttpModule, XHRBackend, RequestOptions } from '@angular/http';
import { Http } from './services/http';
import { httpFactory } from './factories/http.factory';
import { CookieModule, CookieService } from 'ngx-cookie';
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
// import { Angular2FontawesomeModule } from 'angular2-fontawesome';

// Modules/Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Services
import { InnovationService } from './services/innovation/innovation.service';
import { CampaignService } from './services/campaign/campaign.service';
import { DashboardService } from './services/dashboard/dashboard.service';
import { WindowRefService } from './services/window-ref/window-ref.service';
import { TranslateNotificationsService } from './services/notifications/notifications.service';
import { TranslateTitleService } from './services/title/title.service';
import { UserService } from './services/user/user.service';
import { LoaderService } from './services/loader/loader.service';
import { ChartsModule } from 'ng2-charts';
import { IndexService } from './services/index/index.service';
import { ShareService } from './services/share/share.service';
import { AutocompleteService } from './services/autocomplete/autocomplete.service';
import { LatexService } from './services/latex/latex.service';
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
import { PrintService } from './services/print/print.service';
import { CurrentRouteService } from './services/frontend/current-route/current-route.service';

// Resolvers
import { CampaignResolver } from './resolvers/campaign.resolver';
import { InnovationResolver } from './resolvers/innovation.resolver';
import { RequestResolver } from './resolvers/request.resolver';
import { ScenarioResolver } from './resolvers/scenario.resolver';
import { SignatureResolver } from './resolvers/signature.resolver';
import { PresetResolver } from './resolvers/preset.resolver';

@NgModule({
  imports: [
    BrowserModule.withServerTransition({
      appId: 'umi-application-front'
    }),
    HttpModule,
    AppRoutingModule,
    SimpleNotificationsModule.forRoot(),
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (CreateTranslateLoader)
      }
    }),
    ChartsModule,
    Ng2AutoCompleteModule,
    // Angular2FontawesomeModule,
    CookieModule.forRoot()
  ],
  declarations: [
    AppComponent,
  ],
  providers: [
    Title,
    UserService,
    InnovationService,
    CampaignService,
    LoaderService,
    WindowRefService,
    IndexService,
    DashboardService,
    LatexService,
    EmailService,
    ShareService,
    SearchService,
    PresetService,
    AnswerService,
    ProfessionalsService,
    DownloadService,
    TemplatesService,
    {
      provide: Http,
      useFactory: httpFactory,
      deps: [XHRBackend, RequestOptions, LoaderService, NotificationsService]
    },
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
    PrintService,
    CurrentRouteService
  ],
  bootstrap: [AppComponent]
})

export class AppModule {

  constructor(private _translateService: TranslateService,
              private _cookieService: CookieService) {
    this._translateService.addLangs(['en', 'fr']);
    this._translateService.setDefaultLang('en');

    const user_lang = this._cookieService.get('user_lang');
    let browserLang = user_lang || this._translateService.getBrowserLang();
    if (!browserLang.match(/en|fr/)) {
      browserLang = 'en';
    }

    this._cookieService.put('user_lang', browserLang);
    this._translateService.use(browserLang);
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
