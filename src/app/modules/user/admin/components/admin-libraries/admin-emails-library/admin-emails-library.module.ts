import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from "@angular/forms";

import { AdminEmailsLibraryComponent } from "./admin-emails-library.component";

import { SidebarModule } from "../../../../../sidebar/sidebar.module";
import { TableModule } from "../../../../../table/table.module";
import { SidebarWorkflowFormModule } from '../../../../../sidebar/components/workflow-form/sidebar-workflow-form.module';
import { ModalModule } from '../../../../../utility-components/modal/modal.module';
import { MessageSpaceModule } from '../../../../../utility-components/message-space/message-space.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FormsModule,
    SidebarModule,
    TableModule,
    SidebarWorkflowFormModule,
    ModalModule,
    MessageSpaceModule
  ],
  declarations: [
    AdminEmailsLibraryComponent
  ],
  exports: [
    AdminEmailsLibraryComponent
  ]
})

export class AdminEmailsLibraryModule {}
