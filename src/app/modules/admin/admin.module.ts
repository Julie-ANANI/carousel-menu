// Modules externes
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

//Modules
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AdminPresetsModule } from './components/admin-preset/admin-presets/admin-presets.module';
import { AdminQuestionsModule } from './components/admin-preset/admin-questions/admin-questions.module';
import { AdminSectionsModule } from './components/admin-preset/admin-sections/admin-sections.module';
import { AdminSearchModule } from './components/admin-search/admin-search.module';

//Components
import { AdminComponent } from './admin.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { AdminProjectsComponent } from './components/admin-projects/admin-projects.component';
import { AdminCampaignsComponent } from './components/admin-campaigns/admin-campaigns.component';
import { AdminEmailsComponent } from './components/admin-emails/admin-emails.component';
import { AdminIndexComponent } from './components/admin-index/admin-index.component';
import { AdminPatentsComponent } from './components/admin-patents/admin-patents.component';
import { AdminEmailQueueComponent } from './components/admin-emails/admin-emails-queue/admin-emails-queue.component';
import { AdminBatchInformationComponent } from './components/admin-emails/admin-batch-information/admin-batch-information.component';
import { AdminUserDetailsComponent } from './components/admin-users/admin-user-detail/admin-user-details.component';
import { AdminProjectsListComponent } from './components/admin-projects-list/admin-projects-list.component';
import { AdminProjectsDetailsComponent } from './components/admin-projects/admin-project-details/admin-project-details.component';
import { AdminPresetComponent } from './components/admin-preset/admin-preset.component';
import { AdminCampaignComponent } from './components/admin-campaigns/admin-campaign/admin-campaign.component';
import { AdminCampaignDetailsComponent } from './components/admin-campaigns/admin-campaign-details/admin-campaign-details.component';
import { AdminCampaignProsComponent } from './components/admin-campaigns/admin-campaign-pros/admin-campaign-pros.component';
import { AdminCampaignHistoryComponent } from './components/admin-campaigns/admin-campaign-history/admin-campaign-history.component';
import { AdminCampaignSearchComponent } from './components/admin-campaigns/admin-campaign-search/admin-campaign-search.component';
import { AdminCampaignAnswersComponent } from './components/admin-campaigns/admin-campaign-answers/admin-campaign-answers.component';
import { AdminAnswersListComponent } from './components/admin-answers-list/admin-answers-list.component';

//Pipes
import { DateFormatPipe } from '../../pipes/DateFormatPipe';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    AdminPresetsModule,
    AdminQuestionsModule,
    AdminSectionsModule,
    AdminSearchModule,
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
    AdminEmailQueueComponent,
    AdminBatchInformationComponent,
    AdminUserDetailsComponent,
    AdminProjectsListComponent,
    AdminProjectsDetailsComponent,
    AdminPresetComponent,
    AdminCampaignComponent,
    AdminCampaignDetailsComponent,
    AdminCampaignProsComponent,
    AdminCampaignHistoryComponent,
    AdminCampaignSearchComponent,
    AdminCampaignAnswersComponent,
    AdminAnswersListComponent,
    DateFormatPipe
  ]
})
export class AdminModule {
}
