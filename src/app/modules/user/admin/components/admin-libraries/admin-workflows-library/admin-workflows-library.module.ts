import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from "@angular/forms";

import { AdminWorkflowsLibraryComponent } from "./admin-workflows-library.component";
import { AdminEditWorkflowModule } from "../../admin-edit-workflow/admin-edit-workflow.module";
import { ModalModule } from '../../../../../utility-components/modals/modal/modal.module';
import { MessageTemplate1Module } from '../../../../../utility-components/messages/message-template-1/message-template-1.module';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    AdminEditWorkflowModule,
    FormsModule,
    ModalModule,
    MessageTemplate1Module
  ],
  declarations: [
    AdminWorkflowsLibraryComponent
  ],
  exports: [
    AdminWorkflowsLibraryComponent
  ]
})

export class AdminWorkflowsLibraryModule {}
