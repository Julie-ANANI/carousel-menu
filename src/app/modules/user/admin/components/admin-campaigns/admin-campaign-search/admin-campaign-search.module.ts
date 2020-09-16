import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {AdminCampaignSearchComponent} from './admin-campaign-search.component';
import {SharedSearchProsModule} from '../../../../../shared/components/shared-search-pros/shared-search-pros.module';

@NgModule({
  imports: [
    CommonModule,
    SharedSearchProsModule
  ],
  declarations: [
    AdminCampaignSearchComponent
  ]
})

export class AdminCampaignSearchModule {}
