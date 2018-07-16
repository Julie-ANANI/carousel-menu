/* Module */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { ClientProjectModule } from './components/client-project/client-project.module';
import { SharedMarketReportModule } from '../shared/components/shared-market-report/shared-market-report.module';

/* Components */
import { ClientRoutingModule } from './client-routing.module';
import { ClientComponent } from './client.component';
import { ClientMyAccountComponent } from './components/client-my-account/client-my-account.component';
import { ClientSignupComponent } from './components/client-signup/client-signup.component';
import { ClientResetPasswordComponent } from './components/client-reset-password/client-reset-password.component';
import { ClientWelcomeComponent } from './components/client-welcome/client-welcome.component';
import { DiscoverSummaryPipe } from '../../pipes/DiscoverSummaryPipe';
import { ClientForgetPasswordComponent } from './components/client-forget-password/client-forget-password.component';
import { ClientDiscoverPageComponent } from './components/client-discover-page/client-discover-page.component';
import { DiscoverDescriptionComponent } from './components/client-discover-page/discover-description/discover-description.component';
import { GlobalModule } from '../global/global.module';
import { LoginPageComponent } from '../base/component/login-page/login-page.component';
import { LogoutPageComponent } from '../base/component/logout-page/logout-page.component';


@NgModule({
  imports: [
    CommonModule,
    ClientProjectModule,
    ClientRoutingModule,
    SharedModule,
    GlobalModule,
    TranslateModule.forChild(),
    SharedMarketReportModule,
    SharedModule
  ],
  declarations: [
    ClientComponent,
    ClientMyAccountComponent,
    ClientWelcomeComponent,
    ClientSignupComponent,
    ClientResetPasswordComponent,
    DiscoverSummaryPipe,
    ClientForgetPasswordComponent,
    ClientDiscoverPageComponent,
    DiscoverDescriptionComponent,
    LoginPageComponent,
    LogoutPageComponent
  ]
})

export class ClientModule {
}
