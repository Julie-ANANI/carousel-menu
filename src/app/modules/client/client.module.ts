import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ClientProjectModule } from './components/client-project/client-project.module';
import { SharedMarketReportModule } from '../shared/components/shared-market-report/shared-market-report.module';
import { SharedLoaderModule } from '../shared/components/shared-loader/shared-loader.module';
import { PipeModule } from '../../pipe/pipe.module';
import { BaseModule } from '../base/base.module';
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
    BaseModule,
    LoginPageModule,
    SharedMarketReportExampleModule,
    ForgetPasswordPageModule,
    SignupPageModule
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
