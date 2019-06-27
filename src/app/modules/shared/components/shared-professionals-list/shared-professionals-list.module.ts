import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SharedProfessionalsListComponent } from './shared-professionals-list.component';

import { TableModule } from '../../../table/table.module';
import { SidebarModule } from '../../../sidebar/sidebar.module';
import { SidebarUserFormModule } from '../../../sidebar/components/user-form/sidebar-user-form.module';
import { SidebarTagsFormModule } from '../../../sidebar/components/tags-form/sidebar-tags-form.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    TableModule,
    SidebarModule,
    SidebarUserFormModule,
    SidebarTagsFormModule
  ],
  declarations: [
    SharedProfessionalsListComponent
  ],
  exports: [
    SharedProfessionalsListComponent
  ]
})

export class SharedProfessionalsListModule { }
