import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AccountComponent } from './account.component';

import { SidebarUserChangePasswordModule } from '../../../../sidebar/components/user-change-password/sidebar-user-change-password.module';
import { InputListModule } from '../../../../utility-components/input-list/input-list.module';
import { SidebarModule } from '../../../../sidebar/sidebar.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    ReactiveFormsModule,
    RouterModule,
    SidebarUserChangePasswordModule,
    InputListModule,
    SidebarModule
  ],
  declarations: [
    AccountComponent
  ],
  exports: [
    AccountComponent
  ]
})

export class AccountModule {}
