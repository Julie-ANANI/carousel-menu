import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectModule } from '../user/client/components/project/project.module';
import { SharedMarketReportModule } from '../shared/components/shared-market-report/shared-market-report.module';
import { SidebarModule } from '../sidebar/sidebar.module';
import { ClientRoutingModule } from './client-routing.module';
import { ClientComponent } from './client.component';
import { SharedMarketReportExampleModule } from '../shared/components/shared-market-report-example/shared-market-report-example.module';
import { ForgetPasswordModule } from '../common/login/components/forget-password/forget-password.module';
import { WelcomeModule } from '../common/welcome/welcome.module';
import { HeaderModule } from '../base/components/header/header.module';
import { LogoutModule } from '../common/logout/logout.module';
import { InputListModule } from '../utility-components/input-list/input-list.module';
import { SidebarUserChangePasswordModule } from '../sidebar/components/user-change-password/sidebar-user-change-password.module';
import { SynthesisCompleteModule } from '../share/component/synthesis-complete/synthesis-complete.module';
import { SynthesisListModule } from '../user/client/components/synthesis-list/synthesis-list.module';


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
    ClientComponent
  ]
})

export class ClientModule {}
