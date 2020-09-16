import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

import {AdminProjectCampaignsComponent} from './admin-project-campaigns.component';

import {ModalEmptyModule} from '../../../../../utility/modals/modal-empty/modal-empty.module';
import {MessageErrorModule} from '../../../../../utility/messages/message-error/message-error.module';
import {ModalModule} from '../../../../../utility/modals/modal/modal.module';
import {SidebarModule} from '../../../../../sidebars/templates/sidebar/sidebar.module';
import {SidebarCampaignModule} from '../../../../../sidebars/components/sidebar-campaign/sidebar-campaign.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    RouterModule,
    ModalEmptyModule,
    MessageErrorModule,
    ModalModule,
    SidebarModule,
    SidebarCampaignModule,
  ],
  declarations: [
    AdminProjectCampaignsComponent
  ],
  exports: [
    AdminProjectCampaignsComponent
  ]
})

export class AdminProjectCampaignsModule {}
