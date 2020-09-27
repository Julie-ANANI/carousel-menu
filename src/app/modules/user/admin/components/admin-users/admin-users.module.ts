import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AdminUsersRoutingModule } from './admin-users-routing.module';

import { AdminUsersComponent } from './admin-users.component';

import { TableModule } from '../../../../table/table.module';
import { PipeModule } from '../../../../../pipe/pipe.module';
import { SidebarModule } from '../../../../sidebars/templates/sidebar/sidebar.module';
import { SidebarUserFormModule } from '../../../../sidebars/components/user-form/sidebar-user-form.module';
import { ModalModule } from '../../../../utility/modals/modal/modal.module';
import { MessageErrorModule } from "../../../../utility/messages/message-error/message-error.module";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SidebarModule,
    TableModule,
    TranslateModule.forChild(),
    PipeModule,
    FormsModule,
    SidebarUserFormModule,
    ModalModule,
    MessageErrorModule,
    AdminUsersRoutingModule
  ],
  declarations: [
    AdminUsersComponent
  ],
  exports: [
    AdminUsersComponent
  ]
})

export class AdminUsersModule { }
