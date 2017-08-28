import {NgModule} from "@angular/core";
import {BrowserModule, Title} from "@angular/platform-browser";
import {HttpModule, XHRBackend, RequestOptions} from "@angular/http";
import {Http} from "./services/http";
import {httpFactory} from "./factories/http.factory";
import {AppComponent} from "./app.component";
import {AppRoutingModule} from "./app-routing.module";
import {CookieService, CookieOptions} from "angular2-cookie/core";
import {WhitemarkService} from "./services/whitemark/whitemark.service";
import {InnovationService} from "./services/innovation/innovation.service";
import {UserService} from "./services/user/user.service";
import {MediaService} from "./services/media/media.service";
import {SimpleNotificationsModule} from "angular2-notifications";
import {TranslateModule, TranslateLoader, TranslateService} from "@ngx-translate/core";
import {Observable} from "rxjs/Observable";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {LoaderService} from "./services/loader/loader.service";
import {HttpLoaderComponent} from "./components/http-loader/http-loader.component";

// TODO pour problème import npm start : ajouter include ['../node_modules/@ngx-translate', '../node_modules/angular2-materialize'] dans le tsconfig.app.json

@NgModule({
  declarations: [
    AppComponent,
    HttpLoaderComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'umi-application-client'}),
    HttpModule,
    AppRoutingModule,
    SimpleNotificationsModule.forRoot(),
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (CreateTranslateLoader)
      }
    })
  ],
  providers: [
    Title,
    CookieService,
    {
      provide: CookieOptions,
      useValue: {}
    },
    WhitemarkService,
    UserService,
    InnovationService,
    MediaService,
    LoaderService,
    {
      provide: Http,
      useFactory: httpFactory,
      deps: [XHRBackend, RequestOptions, LoaderService ]
    }
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
    return Observable.create(observer => {
      observer.next();
      observer.complete();
    });
  }
}
