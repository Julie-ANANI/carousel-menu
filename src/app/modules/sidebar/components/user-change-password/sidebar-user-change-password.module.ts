import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SidebarModule } from '../../sidebar.module';

import { UserChangePasswordComponent } from './user-change-password.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    SidebarModule
  ],
  declarations: [
    UserChangePasswordComponent
  ],
  exports: [
    UserChangePasswordComponent
  ]
})

export class SidebarUserChangePasswordModule {}
