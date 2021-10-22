import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { AdminEmailsLibraryComponent } from './admin-emails-library.component';

import { SidebarModule } from '../../../../../sidebars/templates/sidebar/sidebar.module';
import { TableModule } from '../../../../../table/table.module';
import { SidebarWorkflowModule } from '../../../../../sidebars/components/sidebar-workflow/sidebar-workflow.module';
import { ModalModule } from '../../../../../utility/modals/modal/modal.module';
import { MessageTemplateModule } from '../../../../../utility/messages/message-template/message-template.module';
import { TableComponentsModule } from '@umius/umi-common-component';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild(),
        FormsModule,
        SidebarModule,
        TableModule,
        SidebarWorkflowModule,
        ModalModule,
        MessageTemplateModule,
        TableComponentsModule
    ],
  declarations: [
    AdminEmailsLibraryComponent
  ],
  exports: [
    AdminEmailsLibraryComponent
  ]
})

export class AdminEmailsLibraryModule {}
