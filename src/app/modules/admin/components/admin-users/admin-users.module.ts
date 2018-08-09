import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule } from '../../../table/table.module';
import { PipeModule } from '../../../../pipe/pipe.module';
import { AdminUsersComponent } from './admin-users.component';
import { SidebarModule } from '../../../sidebar/sidebar.module';
import { InputModule } from '../../../input/input.module';
import { SidebarUserFormModule } from '../../../sidebar/components/user-form/sidebar-user-form.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SidebarModule,
    TableModule,
    TranslateModule.forChild(),
    PipeModule,
    InputModule,
    FormsModule,
    SidebarUserFormModule,
  ],
  declarations: [
    AdminUsersComponent
  ],
  exports: [
    AdminUsersComponent
  ]
})

export class AdminUsersModule { }
