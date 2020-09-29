import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AdminRoutingModule } from './admin-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AdminSearchModule } from './components/admin-search/admin-search.module';
import { AdminUsersModule } from './components/admin-users/admin-users.module';
import { AdminProfessionalsModule } from './components/admin-professionals/admin-professionals.module';
import { AdminMonitoringModule } from './components/admin-monitoring/admin-monitoring.module';
import { AdminTagModule } from './components/admin-tags/admin-tag.module';
import { AdminProjectsModule } from './components/admin-projects/admin-projects.module';
import { AdminLibrariesModule } from './components/admin-libraries/admin-libraries.module';
import { LogoutModule } from '../../common/logout/logout.module';
import { HeaderModule } from '../../common/header/header.module';
import { AdminCommunityModule } from './components/admin-community/admin-community.module';
import { AdminSettingsModule } from './components/admin-settings/admin-settings.module';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    AdminSearchModule,
    AdminMonitoringModule,
    AdminUsersModule,
    AdminProjectsModule,
    AdminProfessionalsModule,
    AdminLibrariesModule,
    AdminTagModule,
    TranslateModule.forChild(),
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HeaderModule,
    LogoutModule,
    AdminCommunityModule,
    FormsModule,
    ReactiveFormsModule,
    AdminSettingsModule
  ]
})

export class AdminModule {}
