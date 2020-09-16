import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {AdminCampaignWorkflowsComponent} from './admin-campaign-workflows.component';
import {FormsModule} from '@angular/forms';
import {MessageTemplateModule} from '../../../../../utility/messages/message-template/message-template.module';
import {AdminEditWorkflowModule} from '../../admin-edit-workflow/admin-edit-workflow.module';
import {ModalModule} from '../../../../../utility/modals/modal/modal.module';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MessageTemplateModule,
    AdminEditWorkflowModule,
    ModalModule,
    TranslateModule.forChild()
  ],
  declarations: [
    AdminCampaignWorkflowsComponent
  ]
})

export class AdminCampaignWorkflowsModule {}
