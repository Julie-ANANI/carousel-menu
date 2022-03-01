import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {AdminCampaignSearchComponent} from './admin-campaign-search.component';
import {SharedSearchProsModule} from '../../../../../shared/components/shared-search-pros/shared-search-pros.module';
import {SharedScrapingModule} from '../../../../../shared/components/shared-scraping/shared-scraping.module';
import { FormsModule } from '@angular/forms';
import { SharedImportProsModule } from '../../../../../shared/components/shared-import-pros/shared-import-pros.module';
import { MessageTemplateModule } from '../../../../../utility/messages/message-template/message-template.module';
import {ModalModule} from '@umius/umi-common-component';

@NgModule({
  imports: [
    CommonModule,
    SharedSearchProsModule,
    SharedScrapingModule,
    FormsModule,
    SharedImportProsModule,
    MessageTemplateModule,
    ModalModule,
  ],
  declarations: [
    AdminCampaignSearchComponent
  ]
})

export class AdminCampaignSearchModule {}
