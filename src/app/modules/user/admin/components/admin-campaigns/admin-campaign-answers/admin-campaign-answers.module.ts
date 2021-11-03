import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {AdminCampaignAnswersComponent} from './admin-campaign-answers.component';
import {MessageTemplate2Module} from '../../../../../utility/messages/message-template-2/message-template-2.module';
import {SidebarModule} from '../../../../../sidebars/templates/sidebar/sidebar.module';
import {SidebarUserAnswerModule} from '../../../../../sidebars/components/sidebar-user-answer/sidebar-user-answer.module';
import { TableComponentsModule } from '@umius/umi-common-component/table';
@NgModule({
    imports: [
        CommonModule,
        MessageTemplate2Module,
        SidebarModule,
        SidebarUserAnswerModule,
        TableComponentsModule
    ],
  declarations: [
    AdminCampaignAnswersComponent
  ]
})

export class AdminCampaignAnswersModule {}
