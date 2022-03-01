import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminCampaignBatchComponent } from './admin-campaign-batch.component';
import {MessageTemplateModule} from '../../../../../utility/messages/message-template/message-template.module';
import {FormsModule} from '@angular/forms';
import {SidebarBatchModule} from '../../../../../sidebars/components/sidebar-batch/sidebar-batch.module';
import {AdminStatsBannerModule} from "../../admin-stats-banner/admin-stats-banner.module";
import {ModalModule, SidebarFullModule, TableModule} from '@umius/umi-common-component';
@NgModule({
  imports: [
    CommonModule,
    MessageTemplateModule,
    FormsModule,
    SidebarBatchModule,
    AdminStatsBannerModule,
    TableModule,
    ModalModule,
    SidebarFullModule
  ],
  declarations: [
    AdminCampaignBatchComponent
  ]
})

export class AdminCampaignBatchModule {}
