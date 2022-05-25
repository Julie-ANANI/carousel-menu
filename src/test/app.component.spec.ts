import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AppComponent } from "../app/app.component";
import { RouterTestingModule } from "@angular/router/testing";
import { SimpleNotificationsModule } from "angular2-notifications";
import { NotFoundModule } from "../app/modules/errors/not-found/not-found.module";
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CookieModule } from "ngx-cookie";
import { BrowserTransferStateModule, By } from "@angular/platform-browser";
import { BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";
import { SpinnerLoaderComponent } from "../app/modules/utility/spinner-loader/spinner-loader.component";

describe('Component - AppComponent', () => {
  let appComponent: AppComponent;
  let spinnerLoaderComponent: SpinnerLoaderComponent;
  let fixture: ComponentFixture<AppComponent>;
  let spinnerLoaderComponentFixture: ComponentFixture<SpinnerLoaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        BrowserTransferStateModule,
        SimpleNotificationsModule.forRoot(),
        NotFoundModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        }),
        HttpClientTestingModule,
        CookieModule.forRoot(),
        BrowserDynamicTestingModule
      ],
      declarations: [AppComponent, SpinnerLoaderComponent]
    }).compileComponents();
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    spinnerLoaderComponentFixture = TestBed.createComponent(SpinnerLoaderComponent);
    appComponent = fixture.componentInstance;
    spinnerLoaderComponent = spinnerLoaderComponentFixture.componentInstance;
    fixture.detectChanges();
  })

  test('#constructor, should create appComponent and show spinner', () => {
    expect(appComponent).toBeTruthy();
    expect(appComponent.spinnerState).toBeTruthy();
    expect(spinnerLoaderComponent).toBeTruthy();
    const debugElement = fixture.debugElement;
    const spinner = debugElement.query(By.directive(SpinnerLoaderComponent));
    expect(spinner).toBeTruthy();
    expect(spinnerLoaderComponent.spinnerState).toBeTruthy();
  })

})
