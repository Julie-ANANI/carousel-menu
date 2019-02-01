import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { AdminCampaignsComponent } from './admin-campaigns.component';
import { AdminCampaignComponent } from './admin-campaign/admin-campaign.component';
import { AdminCampaignAnswersComponent } from './admin-campaign-answers/admin-campaign-answers.component';
import { AdminCampaignDetailsComponent } from './admin-campaign-details/admin-campaign-details.component';
import { AdminCampaignHistoryComponent } from './admin-campaign-history/admin-campaign-history.component';
import { AdminCampaignMailsComponent } from './admin-campaign-mails/admin-campaign-mails.component';
import { AdminCampaignProsComponent } from './admin-campaign-pros/admin-campaign-pros.component';
import { AdminCampaignSearchComponent } from './admin-campaign-search/admin-campaign-search.component';
import { AdminCampaignSearchResultsComponent } from './admin-campaign-search-results/admin-campaign-search-results.component';
import { AdminCampaignTemplatesComponent } from './admin-campaign-templates/admin-campaign-templates.component';
import { AdminCampaignAbtestingComponent } from './admin-campaign-abtesting/admin-campaign-abtesting.component';

import { SharedProsListModule } from '../../../../shared/components/shared-pros-list/shared-pros-list.module';
import { SharedAnswerListModule } from '../../../../shared/components/shared-answers-list/shared-answer-list.module';
import { SharedSearchHistoryModule} from '../../../../shared/components/shared-search-history/search-history.module';
import { SharedSearchProsModule } from '../../../../shared/components/shared-search-pros/shared-search-pros.module';
import { SharedSearchResultsModule } from '../../../../shared/components/shared-search-results/search-results.module';
import { PipeModule } from '../../../../../pipe/pipe.module';
import { SidebarModule } from '../../../../sidebar/sidebar.module';
import { TableModule } from '../../../../table/table.module';
import { AdminEditWorkflowModule } from "../admin-edit-workflow/admin-edit-workflow.module";
import { AutocompleteInputModule } from "../../../../utility-components/autocomplete-input/autocomplete-input.module";
import { SidebarUserAnswerModule } from '../../../../sidebar/components/user-answer/sidebar-user-answer.module';
import { SidebarBatchModule } from '../../../../sidebar/components/sidebar-batch/sidebar-batch.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedProsListModule,
    FormsModule,
    SharedSearchProsModule,
    SharedSearchResultsModule,
    SharedAnswerListModule,
    SharedSearchHistoryModule,
    RouterModule,
    TranslateModule.forChild(),
    SidebarModule,
    PipeModule,
    AdminEditWorkflowModule,
    TableModule,
    PipeModule,
    AutocompleteInputModule,
    SidebarUserAnswerModule,
    SidebarBatchModule
  ],
  declarations: [
    AdminCampaignsComponent,
    AdminCampaignComponent,
    AdminCampaignAnswersComponent,
    AdminCampaignDetailsComponent,
    AdminCampaignHistoryComponent,
    AdminCampaignMailsComponent,
    AdminCampaignProsComponent,
    AdminCampaignSearchComponent,
    AdminCampaignSearchResultsComponent,
    AdminCampaignTemplatesComponent,
    AdminCampaignAbtestingComponent

  ],
  exports: [
    AdminCampaignsComponent,
    AdminCampaignComponent,
    AdminCampaignAnswersComponent,
    AdminCampaignDetailsComponent,
    AdminCampaignHistoryComponent,
    AdminCampaignMailsComponent,
    AdminCampaignProsComponent,
    AdminCampaignSearchResultsComponent,
    AdminCampaignTemplatesComponent
  ]
})

export class AdminCampaignsModule { }
