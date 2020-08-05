import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { AdminCampaignComponent } from './admin-campaign/admin-campaign.component';
import { AdminCampaignAnswersComponent } from './admin-campaign-answers/admin-campaign-answers.component';
import { AdminCampaignHistoryComponent } from './admin-campaign-history/admin-campaign-history.component';
import { AdminCampaignBatchComponent } from './admin-campaign-batch/admin-campaign-batch.component';
import { AdminCampaignProsComponent } from './admin-campaign-pros/admin-campaign-pros.component';
import { AdminCampaignSearchComponent } from './admin-campaign-search/admin-campaign-search.component';
import { AdminCampaignSearchResultsComponent } from './admin-campaign-search-results/admin-campaign-search-results.component';
import { AdminCampaignWorkflowsComponent } from './admin-campaign-workflows/admin-campaign-workflows.component';
import { AdminCampaignStatsComponent } from './admin-campaign-stats/admin-campaign-stats.component';
import { AdminCampaignAbtestingComponent } from './admin-campaign-abtesting/admin-campaign-abtesting.component';

import { SharedSearchHistoryModule} from '../../../../shared/components/shared-search-history/shared-search-history.module';
import { SharedSearchProsModule } from '../../../../shared/components/shared-search-pros/shared-search-pros.module';
import { SharedSearchResultsModule } from '../../../../shared/components/shared-search-results/search-results.module';
import { PipeModule } from '../../../../../pipe/pipe.module';
import { SidebarModule } from '../../../../sidebars/templates/sidebar/sidebar.module';
import { TableModule } from '../../../../table/table.module';
import { AdminEditWorkflowModule } from "../admin-edit-workflow/admin-edit-workflow.module";
import { AutoCompleteInputModule } from "../../../../utility/auto-complete-input/auto-complete-input.module";
import { SidebarUserAnswerModule } from '../../../../sidebars/components/sidebar-user-answer/sidebar-user-answer.module';
import { SidebarBatchModule } from '../../../../sidebars/components/sidebar-batch/sidebar-batch.module';
import { MessageTemplateModule } from '../../../../utility/messages/message-template/message-template.module';
import { ModalModule } from '../../../../utility/modals/modal/modal.module';
import { SidebarUserFormModule } from '../../../../sidebars/components/user-form/sidebar-user-form.module';
import { ErrorTemplate1Module } from '../../../../utility/errors/error-template-1/error-template-1.module';
import { MessageTemplate2Module } from '../../../../utility/messages/message-template-2/message-template-2.module';
import { SharedProfessionalsListModule } from '../../../../shared/components/shared-professionals-list/shared-professionals-list.module';
import { MessageErrorModule } from "../../../../utility/messages/message-error/message-error.module";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
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
    AutoCompleteInputModule,
    SidebarUserAnswerModule,
    SidebarBatchModule,
    MessageTemplateModule,
    ModalModule,
    SidebarUserFormModule,
    ErrorTemplate1Module,
    MessageTemplate2Module,
    SharedProfessionalsListModule,
    MessageErrorModule
  ],
  declarations: [
    AdminCampaignComponent,
    AdminCampaignAnswersComponent,
    AdminCampaignHistoryComponent,
    AdminCampaignBatchComponent,
    AdminCampaignProsComponent,
    AdminCampaignSearchComponent,
    AdminCampaignSearchResultsComponent,
    AdminCampaignWorkflowsComponent,
    AdminCampaignStatsComponent,
    AdminCampaignAbtestingComponent
  ],
  exports: [
    AdminCampaignComponent,
    AdminCampaignAnswersComponent,
    AdminCampaignHistoryComponent,
    AdminCampaignBatchComponent,
    AdminCampaignProsComponent,
    AdminCampaignSearchResultsComponent,
    AdminCampaignWorkflowsComponent,
    AdminCampaignStatsComponent
  ]
})

export class AdminCampaignsModule { }
