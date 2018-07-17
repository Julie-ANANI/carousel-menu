// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedTableModule } from '../../../shared/components/shared-table/table.module';
import { SidebarModule } from '../../../shared/components/shared-sidebar/sidebar.module';
import { PipeModule } from '../../../../pipe/pipe.module';

// Components
import {AdminUsersComponent} from './admin-users.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SidebarModule,
    SharedTableModule,
    TranslateModule.forChild(),
    PipeModule
  ],
  declarations: [
    AdminUsersComponent
  ],
  exports: [
    AdminUsersComponent
  ]
})

export class AdminUsersModule { }
