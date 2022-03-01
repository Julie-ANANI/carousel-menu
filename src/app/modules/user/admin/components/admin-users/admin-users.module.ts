import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AdminUsersRoutingModule } from './admin-users-routing.module';

import { AdminUsersComponent } from './admin-users.component';

import { PipeModule } from '../../../../../pipe/pipe.module';
import { SidebarUserFormModule } from '../../../../sidebars/components/user-form/sidebar-user-form.module';
import { MessageErrorModule } from '../../../../utility/messages/message-error/message-error.module';
import {ModalModule, SidebarFullModule, TableModule} from '@umius/umi-common-component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    PipeModule,
    FormsModule,
    SidebarUserFormModule,
    MessageErrorModule,
    AdminUsersRoutingModule,
    TableModule,
    SidebarFullModule,
    ModalModule,
  ],
  declarations: [
    AdminUsersComponent
  ],
  exports: [
    AdminUsersComponent
  ]
})

export class AdminUsersModule { }
