import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { AdminUsersComponent } from './admin-users.component';

import { TableModule } from '../../../../table/table.module';
import { PipeModule } from '../../../../../pipe/pipe.module';
import { SidebarModule } from '../../../../sidebar/sidebar.module';
import { SidebarUserFormModule } from '../../../../sidebar/components/user-form/sidebar-user-form.module';
import { ModalModule } from '../../../../utility-components/modals/modal/modal.module';

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
    ModalModule
  ],
  declarations: [
    AdminUsersComponent
  ],
  exports: [
    AdminUsersComponent
  ]
})

export class AdminUsersModule { }
