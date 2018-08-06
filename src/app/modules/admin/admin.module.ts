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
import { AdminSettingsComponent } from './components/admin-settings/admin-settings.component';
import { FooterModule } from '../base/components/footer/footer.module';
import { HeaderModule } from '../base/components/header/header.module';
import { NotFoundPageModule } from '../base/components/not-found-page/not-found-page.module';

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
    AdminCampaignsModule,
    AdminProjectModule,
    TranslateModule.forChild(),
    SidebarModule,
    PipeModule,
    BaseModule,
    InputModule,
    AdminCountryManagementModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FooterModule,
    HeaderModule,
    NotFoundPageModule
  ],
  declarations: [
    AdminComponent,
    AdminDashboardComponent,
    AdminIndexComponent,
    AdminPatentsComponent,
    AdminUserDetailsComponent,
    AdminProjectsListComponent,
    AdminSettingsComponent
  ]
})

export class AdminModule {}
