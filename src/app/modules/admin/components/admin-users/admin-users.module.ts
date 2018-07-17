import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedTableModule } from '../../../shared/components/shared-table/table.module';
import { PipeModule } from '../../../../pipe/pipe.module';
import { AdminUsersComponent } from './admin-users.component';
import { SidebarModule } from '../../../sidebar/sidebar.module';
import { InputModule } from '../../../input/input.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SidebarModule,
    SharedTableModule,
    TranslateModule.forChild(),
    PipeModule,
    InputModule,
    FormsModule
  ],
  declarations: [
    AdminUsersComponent
  ],
  exports: [
    AdminUsersComponent
  ]
})

export class AdminUsersModule { }
