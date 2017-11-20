import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { HttpModule, XHRBackend, RequestOptions } from '@angular/http';
import { Http } from './services/http';
import { httpFactory } from './factories/http.factory';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CookieService, CookieOptions } from 'angular2-cookie/core';
import { InnovationService } from './services/innovation/innovation.service';
import { CampaignService } from './services/campaign/campaign.service';
import { SmartQueryService } from './services/smartQuery/smartQuery.service';
import { WindowRefService } from './services/window-ref/window-ref.service';
import { UserService } from './services/user/user.service';
import { MediaService } from './services/media/media.service';
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoaderService } from './services/loader/loader.service';
import { ChartsModule } from 'ng2-charts';
import { IndexService } from './services/index/index.service';
import { ShareService } from './services/share/share.service';
import { AutocompleteService } from './services/autocomplete/autocomplete.service';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';

@NgModule({
  declarations: [
    AppComponent
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
    ShareService,
    SmartQueryService,
    {
      provide: Http,
      useFactory: httpFactory,
      deps: [XHRBackend, RequestOptions, LoaderService, NotificationsService]
    },
    AutocompleteService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private _translateService: TranslateService) {
    _translateService.addLangs(['en', 'fr']);
    _translateService.setDefaultLang('en');

    const browserLang = _translateService.getBrowserLang();
    _translateService.use(browserLang.match(/en|fr/) ? browserLang : 'en');
  }
}

export function CreateTranslateLoader() {
  return new TranslateUniversalLoader();
}

export class TranslateUniversalLoader implements TranslateLoader {
  public getTranslation(lang: string): Observable<any> {
    return Observable.create((observer: any) => {
      observer.next();
      observer.complete();
    });
  }
}
