import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectModule } from '../user/client/components/project/project.module';
import { SharedMarketReportModule } from '../shared/components/shared-market-report/shared-market-report.module';
import { SidebarModule } from '../sidebar/sidebar.module';
import { InputModule } from '../input/input.module';
import { ClientRoutingModule } from './client-routing.module';
import { ClientComponent } from './client.component';
import { ClientMyAccountComponent } from './components/client-my-account/client-my-account.component';
import { ClientResetPasswordComponent } from './components/client-reset-password/client-reset-password.component';
import { SharedMarketReportExampleModule } from '../shared/components/shared-market-report-example/shared-market-report-example.module';
import { ForgetPasswordModule } from '../common/login/components/forget-password/forget-password.module';
import { WelcomeModule } from '../common/welcome/welcome.module';
import { HeaderModule } from '../base/components/header/header.module';
import { LogoutModule } from '../common/logout/logout.module';
import { InputListModule } from '../utility-components/input-list/input-list.module';
import { SidebarUserChangePasswordModule } from '../sidebar/components/user-change-password/sidebar-user-change-password.module';
import { SynthesisCompleteModule } from '../share/component/synthesis-complete/synthesis-complete.module';
import { SynthesisListModule } from './components/synthesis-list/synthesis-list.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProjectModule,
    ClientRoutingModule,
    TranslateModule.forChild(),
    SharedMarketReportModule,
    SidebarModule,
    InputModule,
    SharedMarketReportExampleModule,
    ForgetPasswordModule,
    WelcomeModule,
    HeaderModule,
    LogoutModule,
    InputListModule,
    SidebarUserChangePasswordModule,
    SynthesisCompleteModule,
    SynthesisListModule
  ],
  declarations: [
    ClientComponent,
    ClientMyAccountComponent,
    ClientResetPasswordComponent
  ]
})

export class ClientModule {}
