import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from "@angular/forms";

import { AdminEmailsLibraryComponent } from "./admin-emails-library.component";

import { SidebarModule } from "../../../../../sidebar/sidebar.module";
import { TableModule } from "../../../../../table/table.module";
import { SidebarWorkflowFormModule } from '../../../../../sidebar/components/workflow-form/sidebar-workflow-form.module';
import { ModalModule } from '../../../../../utility-components/modals/modal/modal.module';
import { MessageTemplate1Module } from '../../../../../utility-components/messages/message-template-1/message-template-1.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FormsModule,
    SidebarModule,
    TableModule,
    SidebarWorkflowFormModule,
    ModalModule,
    MessageTemplate1Module
  ],
  declarations: [
    AdminEmailsLibraryComponent
  ],
  exports: [
    AdminEmailsLibraryComponent
  ]
})

export class AdminEmailsLibraryModule {}
