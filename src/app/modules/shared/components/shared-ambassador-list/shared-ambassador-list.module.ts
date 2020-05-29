import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SharedAmbassadorListComponent } from './shared-ambassador-list.component';

import { TableModule } from '../../../table/table.module';
import { SidebarModule } from '../../../sidebars/templates/sidebar/sidebar.module';
import { SidebarUserFormModule } from '../../../sidebars/components/user-form/sidebar-user-form.module';
import { SidebarTagsModule } from '../../../sidebars/components/tags/sidebar-tags.module';
import { ModalModule } from '../../../utility/modals/modal/modal.module';
import { ErrorTemplate1Module } from '../../../utility/errors/error-template-1/error-template-1.module';
import { MessageTemplate1Module } from '../../../utility/messages/message-template-1/message-template-1.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SidebarModule,
    TableModule,
    TranslateModule.forChild(),
    SidebarUserFormModule,
    SidebarTagsModule,
    ModalModule,
    ErrorTemplate1Module,
    MessageTemplate1Module
  ],
  declarations: [
    SharedAmbassadorListComponent
  ],
  exports: [
    SharedAmbassadorListComponent
  ]
})

export class SharedAmbassadorListModule { }
