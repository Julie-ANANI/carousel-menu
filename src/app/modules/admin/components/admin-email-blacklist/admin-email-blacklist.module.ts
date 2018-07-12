// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedTableModule } from '../../../shared/components/shared-table/table.module';
import { SidebarModule } from '../../../shared/components/shared-sidebar/sidebar.module';

// Components
import {AdminEmailBlacklistComponent} from './admin-email-blacklist.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SidebarModule,
    SharedTableModule,
    TranslateModule.forChild()
  ],
  declarations: [
    AdminEmailBlacklistComponent
  ],
  exports: [
    AdminEmailBlacklistComponent
  ]
})

export class AdminEmailBlacklistModule { }
