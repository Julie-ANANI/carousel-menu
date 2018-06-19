import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { ClientProjectModule } from './components/client-project/client-project.module';
import { SharedMarketReportModule } from '../shared/components/shared-market-report/shared-market-report.module';
import { ClientRoutingModule } from './client-routing.module';
import { ClientComponent } from './client.component';
import { ClientMyAccountComponent } from './components/client-my-account/client-my-account.component';
import { ClientDiscoverComponent } from './components/client-discover/client-discover.component';
import { ClientLoginComponent } from './components/client-login/client-login.component';
import { ClientSignupComponent } from './components/client-signup/client-signup.component';
import { ClientLogoutComponent } from './components/client-logout/client-logout.component';
import { ClientResetPasswordComponent } from './components/client-reset-password/client-reset-password.component';
import { ClientWelcomeComponent } from './components/client-welcome/client-welcome.component';
import { DiscoverSummaryPipe } from '../../pipes/DiscoverSummaryPipe';
import { ClientForgetPasswordComponent } from './components/client-forget-password/client-forget-password.component';
import { ClientDiscoverDescriptionModule } from './components/client-discover-description/client-discover-description.module';

@NgModule({
  imports: [
    CommonModule,
    ClientProjectModule,
    ClientRoutingModule,
    SharedModule,
    TranslateModule.forChild(),
    SharedMarketReportModule,
    ClientDiscoverDescriptionModule
  ],
  declarations: [
    ClientComponent,
    ClientMyAccountComponent,
    ClientDiscoverComponent,
    ClientWelcomeComponent,
    ClientLoginComponent,
    ClientSignupComponent,
    ClientLogoutComponent,
    ClientResetPasswordComponent,
    DiscoverSummaryPipe,
    ClientForgetPasswordComponent
  ]
})

export class ClientModule {
}
