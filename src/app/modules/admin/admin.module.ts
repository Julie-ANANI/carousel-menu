// Modules externes
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

// Modules
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AdminPresetModule } from './components/admin-preset/admin-preset.module';
import { AdminSearchModule } from './components/admin-search/admin-search.module';
import { AdminUsersModule } from './components/admin-users/admin-users.module';
import { AdminProfessionalsModule } from './components/admin-professionals/admin-professionals.module';
import { AdminEmailBlacklistModule } from './components/admin-email-blacklist/admin-email-blacklist.module';
import { AdminEmailsModule } from './components/admin-emails/admin-emails.module';
import { AdminTagsModule } from './components/admin-tags/admin-tags.module';
import { AdminProjectModule } from './components/admin-project/admin-project.module';
import { AdminProjectsModule } from './components/admin-projects/admin-projects.module';
import { AdminCampaignsModule } from './components/admin-campaigns/admin-campaigns.module';

// Components
import { AdminComponent } from './admin.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminIndexComponent } from './components/admin-index/admin-index.component';
import { AdminPatentsComponent } from './components/admin-patents/admin-patents.component';
import { AdminUserDetailsComponent } from './components/admin-users/admin-user-detail/admin-user-details.component';
import { AdminProjectsListComponent } from './components/admin-projects-list/admin-projects-list.component';

// Pipes
import { DateFormatPipe } from '../../pipes/DateFormatPipe';
import {GlobalModule} from '../global/global.module';

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
    AdminTagsModule,
    AdminCampaignsModule,
    AdminProjectModule,
    SharedModule,
    GlobalModule,
    TranslateModule.forChild()
  ],
  declarations: [
    AdminComponent,
    AdminDashboardComponent,
    AdminIndexComponent,
    AdminPatentsComponent,
    AdminUserDetailsComponent,
    AdminProjectsListComponent,
    DateFormatPipe
  ]
})
export class AdminModule {
}
