import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {AdminCampaignSearchResultsComponent} from './admin-campaign-search-results.component';
import {SharedSearchResultsModule} from '../../../../../shared/components/shared-search-results/search-results.module';

@NgModule({
  imports: [
    CommonModule,
    SharedSearchResultsModule
  ],
  declarations: [
    AdminCampaignSearchResultsComponent
  ]
})

export class AdminCampaignSearchResultsModule {}
