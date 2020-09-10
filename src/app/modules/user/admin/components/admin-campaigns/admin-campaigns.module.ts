import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AdminCampaignComponent } from './admin-campaign/admin-campaign.component';

import { MessageErrorModule } from "../../../../utility/messages/message-error/message-error.module";
import {AdminCampaignBatchModule} from './admin-campaign-batch/admin-campaign-batch.module';
import {AdminCampaignHistoryModule} from './admin-campaign-history/admin-campaign-history.module';
import {AdminCampaignProsModule} from './admin-campaign-pros/admin-campaign-pros.module';
import {AdminCampaignSearchModule} from './admin-campaign-search/admin-campaign-search.module';
import {AdminCampaignWorkflowsModule} from './admin-campaign-workflows/admin-campaign-workflows.module';
import {AdminCampaignAnswersModule} from './admin-campaign-answers/admin-campaign-answers.module';
import {AdminCampaignSearchResultsModule} from './admin-campaign-search-results/admin-campaign-search-results.module';

@NgModule({
  imports: [
    CommonModule,
    AdminCampaignBatchModule,
    AdminCampaignHistoryModule,
    AdminCampaignProsModule,
    AdminCampaignSearchModule,
    AdminCampaignWorkflowsModule,
    AdminCampaignAnswersModule,
    AdminCampaignSearchResultsModule,
    MessageErrorModule,
    RouterModule
  ],
  declarations: [
    AdminCampaignComponent,
  ],
  exports: [
    AdminCampaignComponent,
  ]
})

export class AdminCampaignsModule { }
