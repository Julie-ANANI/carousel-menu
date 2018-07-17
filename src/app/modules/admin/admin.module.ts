import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminPresetModule } from './components/admin-preset/admin-preset.module';
import { AdminSearchModule } from './components/admin-search/admin-search.module';
import { AdminUsersModule } from './components/admin-users/admin-users.module';
import { AdminProfessionalsModule } from './components/admin-professionals/admin-professionals.module';
import { AdminEmailBlacklistModule } from './components/admin-email-blacklist/admin-email-blacklist.module';
import { AdminEmailsModule } from './components/admin-emails/admin-emails.module';
import { AdminTagModule } from './components/admin-tags/admin-tag.module';
import { AdminProjectModule } from './components/admin-project/admin-project.module';
import { AdminProjectsModule } from './components/admin-projects/admin-projects.module';
import { AdminCampaignsModule } from './components/admin-campaigns/admin-campaigns.module';
import { GlobalModule } from '../global/global.module';
import { AdminLibrariesModule } from "./components/admin-libraries/admin-libraries.module";

// Components
import { PipeModule } from '../../pipe/pipe.module';
import { BaseModule } from '../base/base.module';
import { SidebarModule } from '../sidebar/sidebar.module';
import { InputModule } from '../input/input.module';
import { AdminComponent } from './admin.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminIndexComponent } from './components/admin-index/admin-index.component';
import { AdminPatentsComponent } from './components/admin-patents/admin-patents.component';
import { AdminUserDetailsComponent } from './components/admin-users/admin-user-detail/admin-user-details.component';
import { AdminProjectsListComponent } from './components/admin-projects-list/admin-projects-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    AdminPresetModule,
    AdminSearchModule,
    AdminEmailsModule,
    AdminUsersModule,
    AdminProjectsModule,
    AdminProfessionalsModule,
    AdminEmailBlacklistModule,
    AdminTagModule,
    AdminCampaignsModule,
    AdminProjectModule,
    TranslateModule.forChild(),
    SidebarModule,
    PipeModule,
    BaseModule,
    InputModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  declarations: [
    AdminComponent,
    AdminDashboardComponent,
    AdminIndexComponent,
    AdminPatentsComponent,
    AdminUserDetailsComponent,
    AdminProjectsListComponent
  ]
})

export class AdminModule {}
