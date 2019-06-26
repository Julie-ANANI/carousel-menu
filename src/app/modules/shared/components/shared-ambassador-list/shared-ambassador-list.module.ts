import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SharedAmbassadorListComponent } from './shared-ambassador-list.component';

import { TableModule } from '../../../table/table.module';
import { SidebarModule } from '../../../sidebar/sidebar.module';
import { SidebarUserFormModule } from '../../../sidebar/components/user-form/sidebar-user-form.module';
import { SidebarTagsFormModule } from '../../../sidebar/components/tags-form/sidebar-tags-form.module';
import { ModalModule } from '../../../utility-components/modals/modal/modal.module';
import { ErrorTemplate1Module } from '../../../utility-components/errors/error-template-1/error-template-1.module';
import { MessageSpaceModule } from '../../../utility-components/messages/message-template-1/message-space.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SidebarModule,
    TableModule,
    TranslateModule.forChild(),
    SidebarUserFormModule,
    SidebarTagsFormModule,
    ModalModule,
    ErrorTemplate1Module,
    MessageSpaceModule
  ],
  declarations: [
    SharedAmbassadorListComponent
  ],
  exports: [
    SharedAmbassadorListComponent
  ]
})

export class SharedAmbassadorListModule { }
