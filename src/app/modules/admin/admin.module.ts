import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AdminRoutingModule } from './admin-routing.module';
// import { AdminPresetModule } from './components/admin-preset/admin-preset.module';
import { AdminSearchModule } from './components/admin-search/admin-search.module';
import { AdminUsersModule } from './components/admin-users/admin-users.module';
import { AdminProfessionalsModule } from './components/admin-professionals/admin-professionals.module';
import { AdminMonitoringModule } from './components/admin-monitoring/admin-monitoring.module';
import { AdminTagModule } from './components/admin-tags/admin-tag.module';
import { AdminProjectModule } from './components/admin-project/admin-project.module';
import { AdminProjectsModule } from './components/admin-projects/admin-projects.module';
import { AdminCampaignsModule } from './components/admin-campaigns/admin-campaigns.module';
import { AdminLibrariesModule } from './components/admin-libraries/admin-libraries.module';
import { AdminCountryManagementModule } from './components/admin-settings/admin-country-management/admin-country-management.module';
import { PipeModule } from '../../pipe/pipe.module';
import { SidebarModule } from '../sidebar/sidebar.module';
import { InputModule } from '../input/input.module';
import { AdminComponent } from './admin.component';
import { AdminIndexComponent } from './components/admin-index/admin-index.component';
import { AdminPatentsComponent } from './components/admin-patents/admin-patents.component';
import { AdminUserDetailsComponent } from './components/admin-users/admin-user-detail/admin-user-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminSettingsComponent } from './components/admin-settings/admin-settings.component';
import { HeaderModule } from '../base/components/header/header.module';
import { NotFoundPageModule } from '../base/components/not-found-page/not-found-page.module';
import { LogoutPageModule } from '../base/components/logout-page/logout-page.module';
import { InputListModule } from '../input/component/input-list/input-list.module';
import { SidebarInnovationPreviewModule } from '../sidebar/components/innovation-preview/sidebar-innovation-preview.module';
import { AdminDashboardModule } from './components/admin-dashboard/admin-dashboard.module';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
  //  AdminPresetModule,
    AdminSearchModule,
    AdminMonitoringModule,
    AdminUsersModule,
    AdminProjectsModule,
    AdminProfessionalsModule,
    AdminLibrariesModule,
    AdminTagModule,
    AdminDashboardModule,
    AdminCampaignsModule,
    AdminProjectModule,
    TranslateModule.forChild(),
    SidebarModule,
    PipeModule,
    InputModule,
    AdminCountryManagementModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HeaderModule,
    NotFoundPageModule,
    LogoutPageModule,
    InputListModule,
    SidebarInnovationPreviewModule
  ],
  declarations: [
    AdminComponent,
    AdminIndexComponent,
    AdminPatentsComponent,
    AdminUserDetailsComponent,
    AdminSettingsComponent
  ]
})

export class AdminModule {}
