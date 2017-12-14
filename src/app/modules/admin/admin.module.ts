import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { AdminProjectsComponent } from './components/admin-projects/admin-projects.component';
import { AdminCampaignsComponent } from './components/admin-campaigns/admin-campaigns.component';
import { AdminEmailsComponent } from './components/admin-emails/admin-emails.component';
import { AdminIndexComponent } from './components/admin-index/admin-index.component';
import { AdminPatentsComponent } from './components/admin-patents/admin-patents.component';
import { AdminSearchesComponent } from './components/admin-searches/admin-searches.component';
import { AdminEmailQueueComponent } from './components/admin-emails/admin-emails-queue/admin-emails-queue.component';
import { AdminBatchInformationComponent } from './components/admin-emails/admin-batch-information/admin-batch-information.component';
import { AdminProjectsListComponent } from './components/admin-projects-list/admin-projects-list.component';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    TranslateModule.forChild()
  ],
  declarations: [
    AdminComponent,
    AdminDashboardComponent,
    AdminUsersComponent,
    AdminUsersComponent,
    AdminProjectsComponent,
    AdminCampaignsComponent,
    AdminEmailsComponent,
    AdminIndexComponent,
    AdminPatentsComponent,
    AdminSearchesComponent,
    AdminEmailQueueComponent,
    AdminBatchInformationComponent,
    AdminProjectsListComponent
  ]
})
export class AdminModule {
}
