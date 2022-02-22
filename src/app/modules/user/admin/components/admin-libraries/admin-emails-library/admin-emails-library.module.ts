import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { AdminEmailsLibraryComponent } from './admin-emails-library.component';
import { SidebarWorkflowModule } from '../../../../../sidebars/components/sidebar-workflow/sidebar-workflow.module';
import { MessageTemplateModule } from '../../../../../utility/messages/message-template/message-template.module';
import {ModalModule, SidebarFullModule, TableModule} from '@umius/umi-common-component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FormsModule,
    SidebarWorkflowModule,
    MessageTemplateModule,
    TableModule,
    SidebarFullModule,
    ModalModule,
  ],
  declarations: [
    AdminEmailsLibraryComponent
  ],
  exports: [
    AdminEmailsLibraryComponent
  ]
})

export class AdminEmailsLibraryModule {}
