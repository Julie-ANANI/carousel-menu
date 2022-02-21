import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

import {AdminProjectCampaignsComponent} from './admin-project-campaigns.component';

import {MessageErrorModule} from '../../../../../utility/messages/message-error/message-error.module';
import {SidebarCampaignModule} from '../../../../../sidebars/components/sidebar-campaign/sidebar-campaign.module';
import {ModalModule, SidebarFullModule} from '@umius/umi-common-component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    RouterModule,
    MessageErrorModule,
    SidebarCampaignModule,
    ModalModule,
    SidebarFullModule,
  ],
  declarations: [
    AdminProjectCampaignsComponent
  ],
  exports: [
    AdminProjectCampaignsComponent
  ]
})

export class AdminProjectCampaignsModule {}
