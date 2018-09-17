import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ClientProjectModule } from './components/client-project/client-project.module';
import { SharedMarketReportModule } from '../shared/components/shared-market-report/shared-market-report.module';
import { SharedLoaderModule } from '../shared/components/shared-loader/shared-loader.module';
import { PipeModule } from '../../pipe/pipe.module';
import { SidebarModule } from '../sidebar/sidebar.module';
import { InputModule } from '../input/input.module';
import { ClientRoutingModule } from './client-routing.module';
import { ClientComponent } from './client.component';
import { ClientMyAccountComponent } from './components/client-my-account/client-my-account.component';
import { ClientResetPasswordComponent } from './components/client-reset-password/client-reset-password.component';
import { ClientDiscoverPageComponent } from './components/client-discover-page/client-discover-page.component';
import { DiscoverDescriptionComponent } from './components/client-discover-page/discover-description/discover-description.component';
import { SharedMarketReportExampleModule } from '../shared/components/shared-market-report-example/shared-market-report-example.module';
import { LoginPageModule } from '../base/components/login-page/login-page.module';
import { ForgetPasswordPageModule } from '../base/components/forget-password-page/forget-password-page.module';
import { SignupPageModule } from '../base/components/signup-page/signup-page.module';
import { WelcomePageModule } from '../base/components/welcome-page/welcome-page.module';
import { FooterModule } from '../base/components/footer/footer.module';
import { HeaderModule } from '../base/components/header/header.module';
import { NotFoundPageModule } from '../base/components/not-found-page/not-found-page.module';
import { LogoutPageModule } from '../base/components/logout-page/logout-page.module';
import { InputListModule } from '../input/component/input-list/input-list.module';
import { SearchInputModule } from '../input/component/search-input/search-input.module';
import { PaginationModule } from '../input/component/pagination/pagination.module';
import { SidebarUserChangePasswordModule } from '../sidebar/components/user-change-password/sidebar-user-change-password.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ClientProjectModule,
    ClientRoutingModule,
    TranslateModule.forChild(),
    SharedMarketReportModule,
    SharedLoaderModule,
    SidebarModule,
    InputModule,
    PipeModule,
    LoginPageModule,
    SharedMarketReportExampleModule,
    ForgetPasswordPageModule,
    SignupPageModule,
    WelcomePageModule,
    FooterModule,
    HeaderModule,
    NotFoundPageModule,
    LogoutPageModule,
    InputListModule,
    SearchInputModule,
    PaginationModule,
    SidebarUserChangePasswordModule
  ],
  declarations: [
    ClientComponent,
    ClientMyAccountComponent,
    ClientResetPasswordComponent,
    ClientDiscoverPageComponent,
    DiscoverDescriptionComponent,
  ]
})

export class ClientModule {}
