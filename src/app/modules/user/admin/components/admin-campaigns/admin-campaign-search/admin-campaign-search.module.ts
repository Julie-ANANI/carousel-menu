import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {AdminCampaignSearchComponent} from './admin-campaign-search.component';
import {SharedSearchProsModule} from '../../../../../shared/components/shared-search-pros/shared-search-pros.module';
import {SharedScrapingModule} from '../../../../../shared/components/shared-scraping/shared-scraping.module';

@NgModule({
  imports: [
    CommonModule,
    SharedSearchProsModule,
    SharedScrapingModule
  ],
  declarations: [
    AdminCampaignSearchComponent
  ]
})

export class AdminCampaignSearchModule {}
