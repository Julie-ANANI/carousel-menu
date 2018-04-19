// Modules externes
import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { HttpModule, XHRBackend, RequestOptions } from '@angular/http';
import { Http } from './services/http';
import { httpFactory } from './factories/http.factory';
import { CookieService, CookieOptions } from 'angular2-cookie/core';
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';

// Modules/Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './directives/footer/footer.component';
import { HeaderComponent } from './directives/header/header.component';

// Services
import { InnovationService } from './services/innovation/innovation.service';
import { CampaignService } from './services/campaign/campaign.service';
import { DashboardService } from './services/dashboard/dashboard.service';
import { WindowRefService } from './services/window-ref/window-ref.service';
import { TranslateNotificationsService } from './services/notifications/notifications.service';
import { TranslateTitleService } from './services/title/title.service';
import { UserService } from './services/user/user.service';
import { MediaService } from './services/media/media.service';
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

// Resolvers
import { CampaignResolver } from './resolvers/campaign.resolver';
import { InnovationResolver } from './resolvers/innovation.resolver';
import { RequestResolver } from './resolvers/request.resolver';
import { ScenarioResolver } from './resolvers/scenario.resolver';
import { SignatureResolver } from './resolvers/signature.resolver';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent
  ],
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
    Ng2AutoCompleteModule
  ],
  providers: [
    Title,
    CookieService,
    {
      provide: CookieOptions,
      useValue: {}
    },
    UserService,
    InnovationService,
    CampaignService,
    MediaService,
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
    TagsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private _translateService: TranslateService) {
    this._translateService.addLangs(['en', 'fr']);
    this._translateService.setDefaultLang('en');

    const browserLang = this._translateService.getBrowserLang();
    this._translateService.use(browserLang.match(/en|fr/) ? browserLang : 'en');
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
