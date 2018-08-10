import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule } from '../../../table/table.module';
import { SidebarModule } from '../../../sidebar/sidebar.module';
import { SharedProsListComponent } from './shared-pros-list.component';
import { SidebarUserFormModule } from '../../../sidebar/components/user-form/sidebar-user-form.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SidebarModule,
    TableModule,
    TranslateModule.forChild(),
    SidebarUserFormModule
  ],
  declarations: [
    SharedProsListComponent
  ],
  exports: [
    SharedProsListComponent
  ]
})

export class SharedProsListModule { }
