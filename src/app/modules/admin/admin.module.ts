// Modules externes
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

// Modules
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SharedAnswerModalModule } from '../shared/components/shared-answer-modal/answer-modal.module';
import { SharedMarketReportModule } from '../shared/components/shared-market-report/shared-market-report.module';
import { AdminPresetsModule } from './components/admin-preset/admin-presets/admin-presets.module';
import { AdminQuestionsModule } from './components/admin-preset/admin-questions/admin-questions.module';
import { AdminSectionsModule } from './components/admin-preset/admin-sections/admin-sections.module';
import { AdminSearchModule } from './components/admin-search/admin-search.module';
import { AdminEmailsModule } from './components/admin-emails/admin-emails.module';
import { AdminTagsComponent } from './components/admin-tags/admin-tags.component';
import { AdminTagListComponent } from './components/admin-tags/admin-tag-list/admin-tag-list.component';
import { AdminTagNewComponent } from './components/admin-tags/admin-tag-new/admin-tag-new.component';

// Components
import { AdminComponent } from './admin.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { AdminProjectsComponent } from './components/admin-projects/admin-projects.component';
import { AdminCampaignsComponent } from './components/admin-campaigns/admin-campaigns.component';
import { AdminIndexComponent } from './components/admin-index/admin-index.component';
import { AdminPatentsComponent } from './components/admin-patents/admin-patents.component';
import { AdminUserDetailsComponent } from './components/admin-users/admin-user-detail/admin-user-details.component';
import { AdminProjectsListComponent } from './components/admin-projects-list/admin-projects-list.component';
import { AdminProjectsDetailsComponent } from './components/admin-projects/admin-project-details/admin-project-details.component';
import { AdminPresetComponent } from './components/admin-preset/admin-preset.component';
import { AdminCampaignComponent } from './components/admin-campaigns/admin-campaign/admin-campaign.component';
import { AdminCampaignMailsComponent } from './components/admin-campaigns/admin-campaign-mails/admin-campaign-mails.component';
import { AdminCampaignTemplatesComponent } from './components/admin-campaigns/admin-campaign-templates/admin-campaign-templates.component';
import { AdminCampaignDetailsComponent } from './components/admin-campaigns/admin-campaign-details/admin-campaign-details.component';
import { AdminCampaignProsComponent } from './components/admin-campaigns/admin-campaign-pros/admin-campaign-pros.component';
import { AdminCampaignHistoryComponent } from './components/admin-campaigns/admin-campaign-history/admin-campaign-history.component';
import { AdminCampaignSearchComponent } from './components/admin-campaigns/admin-campaign-search/admin-campaign-search.component';
import { AdminCampaignAnswersComponent } from './components/admin-campaigns/admin-campaign-answers/admin-campaign-answers.component';
import { AdminCampaignSearchResultsComponent } from './components/admin-campaigns/admin-campaign-search-results/admin-campaign-search-results.component';
import { AdminAnswersListComponent } from './components/admin-answers-list/admin-answers-list.component';

// Pipes
import { DateFormatPipe } from '../../pipes/DateFormatPipe';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    AdminPresetsModule,
    AdminQuestionsModule,
    AdminSectionsModule,
    AdminSearchModule,
    AdminEmailsModule,
    SharedModule,
    SharedAnswerModalModule,
    SharedMarketReportModule,
    TranslateModule.forChild()
  ],
  declarations: [
    AdminComponent,
    AdminDashboardComponent,
    AdminUsersComponent,
    AdminUsersComponent,
    AdminProjectsComponent,
    AdminCampaignsComponent,
    AdminIndexComponent,
    AdminPatentsComponent,
    AdminUserDetailsComponent,
    AdminProjectsListComponent,
    AdminProjectsDetailsComponent,
    AdminPresetComponent,
    AdminCampaignComponent,
    AdminCampaignMailsComponent,
    AdminCampaignTemplatesComponent,
    AdminCampaignDetailsComponent,
    AdminCampaignProsComponent,
    AdminCampaignHistoryComponent,
    AdminCampaignSearchComponent,
    AdminCampaignAnswersComponent,
    AdminAnswersListComponent,
    AdminCampaignSearchResultsComponent,
    DateFormatPipe,
    AdminTagsComponent,
    AdminTagListComponent,
    AdminTagNewComponent
  ]
})
export class AdminModule {
}
