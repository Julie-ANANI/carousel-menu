import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {AdminCampaignHistoryComponent} from './admin-campaign-history.component';
import {SharedSearchHistoryModule} from '../../../../../shared/components/shared-search-history/shared-search-history.module';
import {AdminStatsBannerModule} from '../../admin-stats-banner/admin-stats-banner.module';

@NgModule({
    imports: [
        CommonModule,
        SharedSearchHistoryModule,
        AdminStatsBannerModule,
    ],
  declarations: [
    AdminCampaignHistoryComponent
  ]
})

export class AdminCampaignHistoryModule {}
