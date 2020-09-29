import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminCampaignBatchComponent } from './admin-campaign-batch.component';
import {MessageTemplateModule} from '../../../../../utility/messages/message-template/message-template.module';
import {FormsModule} from '@angular/forms';
import {TableModule} from '../../../../../table/table.module';
import {ModalModule} from '../../../../../utility/modals/modal/modal.module';
import {SidebarModule} from '../../../../../sidebars/templates/sidebar/sidebar.module';
import {SidebarBatchModule} from '../../../../../sidebars/components/sidebar-batch/sidebar-batch.module';

@NgModule({
  imports: [
    CommonModule,
    MessageTemplateModule,
    FormsModule,
    TableModule,
    ModalModule,
    SidebarModule,
    SidebarBatchModule
  ],
  declarations: [
    AdminCampaignBatchComponent
  ]
})

export class AdminCampaignBatchModule {}
