import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { AdminCampaignsComponent } from './admin-campaigns.component';
import { AdminCampaignComponent } from './admin-campaign/admin-campaign.component';
import { AdminCampaignAnswersComponent } from './admin-campaign-answers/admin-campaign-answers.component';
import { AdminCampaignQuizComponent } from './admin-campaign-quiz/admin-campaign-quiz.component';
import { AdminCampaignHistoryComponent } from './admin-campaign-history/admin-campaign-history.component';
import { AdminCampaignBatchComponent } from './admin-campaign-batch/admin-campaign-batch.component';
import { AdminCampaignProsComponent } from './admin-campaign-pros/admin-campaign-pros.component';
import { AdminCampaignSearchComponent } from './admin-campaign-search/admin-campaign-search.component';
import { AdminCampaignSearchResultsComponent } from './admin-campaign-search-results/admin-campaign-search-results.component';
import { AdminCampaignWorkflowsComponent } from './admin-campaign-workflows/admin-campaign-workflows.component';
import { AdminCampaignAbtestingComponent } from './admin-campaign-abtesting/admin-campaign-abtesting.component';

import { SharedProsListModule } from '../../../../shared/components/shared-pros-list/shared-pros-list.module';
import { SharedSearchHistoryModule} from '../../../../shared/components/shared-search-history/search-history.module';
import { SharedSearchProsModule } from '../../../../shared/components/shared-search-pros/shared-search-pros.module';
import { SharedSearchResultsModule } from '../../../../shared/components/shared-search-results/search-results.module';
import { PipeModule } from '../../../../../pipe/pipe.module';
import { SidebarModule } from '../../../../sidebar/sidebar.module';
import { TableModule } from '../../../../table/table.module';
import { AdminEditWorkflowModule } from "../admin-edit-workflow/admin-edit-workflow.module";
import { AutocompleteInputModule } from "../../../../utility-components/autocomplete-input/autocomplete-input.module";
import { SidebarUserAnswerModule } from '../../../../sidebar/components/user-answer/sidebar-user-answer.module';
import { SidebarBatchFormModule } from '../../../../sidebar/components/batch-form/sidebar-batch-form.module';
import { MessageSpaceModule } from '../../../../utility-components/message-space/message-space.module';
import { ModalModule } from '../../../../utility-components/modal/modal.module';
import { SidebarUserFormModule } from '../../../../sidebar/components/user-form/sidebar-user-form.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedProsListModule,
    FormsModule,
    SharedSearchProsModule,
    SharedSearchResultsModule,
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
    SidebarBatchFormModule,
    MessageSpaceModule,
    ModalModule,
    SidebarUserFormModule,
  ],
  declarations: [
    AdminCampaignsComponent,
    AdminCampaignComponent,
    AdminCampaignAnswersComponent,
    AdminCampaignQuizComponent,
    AdminCampaignHistoryComponent,
    AdminCampaignBatchComponent,
    AdminCampaignProsComponent,
    AdminCampaignSearchComponent,
    AdminCampaignSearchResultsComponent,
    AdminCampaignWorkflowsComponent,
    AdminCampaignAbtestingComponent

  ],
  exports: [
    AdminCampaignsComponent,
    AdminCampaignComponent,
    AdminCampaignAnswersComponent,
    AdminCampaignQuizComponent,
    AdminCampaignHistoryComponent,
    AdminCampaignBatchComponent,
    AdminCampaignProsComponent,
    AdminCampaignSearchResultsComponent,
    AdminCampaignWorkflowsComponent
  ]
})

export class AdminCampaignsModule { }
