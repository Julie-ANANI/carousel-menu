import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from "@angular/forms";

import { AdminLibrariesWorkflowsComponent } from "./admin-libraries-workflows.component";
import { AdminEditWorkflowModule } from "../../admin-edit-workflow/admin-edit-workflow.module";
import { ModalModule } from '../../../../../utility/modals/modal/modal.module';
import { MessageErrorModule } from "../../../../../utility/messages/message-error/message-error.module";
import { MessageTemplateModule } from "../../../../../utility/messages/message-template/message-template.module";

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    AdminEditWorkflowModule,
    FormsModule,
    ModalModule,
    MessageErrorModule,
    MessageTemplateModule
  ],
  declarations: [
    AdminLibrariesWorkflowsComponent
  ],
  exports: [
    AdminLibrariesWorkflowsComponent
  ]
})

export class AdminLibrariesWorkflowsModule {}
