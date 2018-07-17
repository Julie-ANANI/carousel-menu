/* Module */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ClientProjectModule } from './components/client-project/client-project.module';
import { SharedMarketReportModule } from '../shared/components/shared-market-report/shared-market-report.module';
import { SharedLoaderModule } from '../shared/components/shared-loader/shared-loader.module';
import { SidebarModule } from '../shared/components/shared-sidebar/sidebar.module';
import { InputListModule } from '../../directives/input-list/input-list.module';
import { SearchInputModule } from '../../directives/search-input/search-input.module';
import { GlobalModule } from '../global/global.module';
import { HeaderModule } from '../base/component/header/header.module';
import { FooterModule } from '../base/component/footer/footer.module';
import { PipeModule } from '../../pipe/pipe.module';

/* Components */
import { ClientRoutingModule } from './client-routing.module';
import { ClientComponent } from './client.component';
import { ClientMyAccountComponent } from './components/client-my-account/client-my-account.component';
import { ClientResetPasswordComponent } from './components/client-reset-password/client-reset-password.component';
import { ClientWelcomeComponent } from './components/client-welcome/client-welcome.component';
import { ClientDiscoverPageComponent } from './components/client-discover-page/client-discover-page.component';
import { DiscoverDescriptionComponent } from './components/client-discover-page/discover-description/discover-description.component';
import { LoginPageComponent } from '../base/component/login-page/login-page.component';
import { LogoutPageComponent } from '../base/component/logout-page/logout-page.component';
import { ForgetPasswordPageComponent } from '../base/component/forget-password-page/forget-password-page.component';
import { SignupPageComponent } from '../base/component/signup-page/signup-page.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ClientProjectModule,
    ClientRoutingModule,
    GlobalModule,
    TranslateModule.forChild(),
    SharedMarketReportModule,
    SharedLoaderModule,
    SidebarModule,
    InputListModule,
    SearchInputModule,
    HeaderModule,
    FooterModule,
    PipeModule
  ],
  declarations: [
    ClientComponent,
    ClientMyAccountComponent,
    ClientWelcomeComponent,
    ClientResetPasswordComponent,
    ClientDiscoverPageComponent,
    DiscoverDescriptionComponent,
    LoginPageComponent,
    LogoutPageComponent,
    ForgetPasswordPageComponent,
    SignupPageComponent
  ]
})

export class ClientModule {
}
