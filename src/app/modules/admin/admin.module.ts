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
import { AdminUserDetailsComponent } from './components/admin-users/admin-user-detail/admin-user-details.component';
import { InputListComponent } from '../../directives/input-list/input-list.component';
import { AdminProjectsListComponent } from './components/admin-projects-list/admin-projects-list.component';
import { AdminProjectsDetailsComponent } from './components/admin-projects/admin-project-details/admin-project-details.component';
import { AdminPresetsComponent } from './components/admin-presets/admin-presets.component';
import { AdminPresetsListComponent } from './components/admin-presets/admin-presets-list/admin-presets-list.component';
import { AdminSectionsListComponent } from './components/admin-presets/admin-sections-list/admin-sections-list.component';
import { AdminQuestionsListComponent } from './components/admin-presets/admin-questions-list/admin-questions-list.component';
import { AdminQuestionNewComponent } from './components/admin-presets/admin-question-new/admin-question-new.component';
import { AdminQuestionEditComponent } from './components/admin-presets/admin-question-edit/admin-question-edit.component';
import { AdminSectionNewComponent } from './components/admin-presets/admin-section-new/admin-section-new.component';
import { AdminSectionEditComponent } from './components/admin-presets/admin-section-edit/admin-section-edit.component';

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
    AdminUserDetailsComponent,
    AdminProjectsListComponent,
    AdminProjectsDetailsComponent,
    AdminPresetsComponent,
    AdminPresetsListComponent,
    AdminSectionsListComponent,
    AdminQuestionsListComponent,
    AdminQuestionNewComponent,
    AdminQuestionEditComponent,
    AdminSectionNewComponent,
    AdminSectionEditComponent
  ]
})
export class AdminModule {
}
