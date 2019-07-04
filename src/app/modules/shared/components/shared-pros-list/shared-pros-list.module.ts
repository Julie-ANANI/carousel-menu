import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SharedProsListComponent } from './shared-pros-list.component';

import { TableModule } from '../../../table/table.module';
import { SidebarModule } from '../../../sidebar/sidebar.module';
import { SidebarUserFormModule } from '../../../sidebar/components/user-form/sidebar-user-form.module';
import { SidebarTagsModule } from '../../../sidebar/components/tags/sidebar-tags.module';
import { ModalModule } from '../../../utility-components/modals/modal/modal.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SidebarModule,
    TableModule,
    TranslateModule.forChild(),
    SidebarUserFormModule,
    SidebarTagsModule,
    ModalModule
  ],
  declarations: [
    SharedProsListComponent
  ],
  exports: [
    SharedProsListComponent
  ]
})

export class SharedProsListModule { }
