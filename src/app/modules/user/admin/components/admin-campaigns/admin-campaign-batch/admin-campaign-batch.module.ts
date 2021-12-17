import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminCampaignBatchComponent } from './admin-campaign-batch.component';
import {MessageTemplateModule} from '../../../../../utility/messages/message-template/message-template.module';
import {FormsModule} from '@angular/forms';
import {ModalModule} from '../../../../../utility/modals/modal/modal.module';
import {SidebarModule} from '../../../../../sidebars/templates/sidebar/sidebar.module';
import {SidebarBatchModule} from '../../../../../sidebars/components/sidebar-batch/sidebar-batch.module';
import { TableComponentsModule } from '@umius/umi-common-component/table';
import {AdminStatsBannerModule} from "../../admin-stats-banner/admin-stats-banner.module";
@NgModule({
    imports: [
        CommonModule,
        MessageTemplateModule,
        FormsModule,
        ModalModule,
        SidebarModule,
        SidebarBatchModule,
        TableComponentsModule,
        AdminStatsBannerModule
    ],
  declarations: [
    AdminCampaignBatchComponent
  ]
})

export class AdminCampaignBatchModule {}
