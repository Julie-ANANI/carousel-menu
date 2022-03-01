import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AccountComponent } from './account.component';

import { SidebarUserChangePasswordModule } from '../../../../sidebars/components/user-change-password/sidebar-user-change-password.module';
import { InputListModule } from '../../../../utility/input-list/input-list.module';
import { NguiAutoCompleteModule } from '../../../../utility/auto-complete/auto-complete.module';
import {AccountRoutingModule} from './account-routing.module';
import {ModalModule, SidebarFullModule} from '@umius/umi-common-component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    ReactiveFormsModule,
    RouterModule,
    SidebarUserChangePasswordModule,
    InputListModule,
    NguiAutoCompleteModule,
    AccountRoutingModule,
    SidebarFullModule,
    ModalModule
  ],
  declarations: [
    AccountComponent
  ],
  exports: [
    AccountComponent
  ]
})

export class AccountModule {}
