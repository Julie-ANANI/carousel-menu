import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {AdminCampaignAnswersComponent} from './admin-campaign-answers.component';
import {MessageTemplate2Module} from '../../../../../utility/messages/message-template-2/message-template-2.module';
import {SidebarUserAnswerModule} from '../../../../../sidebars/components/sidebar-user-answer/sidebar-user-answer.module';
import {SidebarFullModule, TableModule} from '@umius/umi-common-component';
@NgModule({
  imports: [
    CommonModule,
    MessageTemplate2Module,
    SidebarUserAnswerModule,
    TableModule,
    SidebarFullModule,
  ],
  declarations: [
    AdminCampaignAnswersComponent
  ]
})

export class AdminCampaignAnswersModule {}
