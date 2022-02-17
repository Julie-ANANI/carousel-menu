import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { UserChangePasswordComponent } from './user-change-password.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild()
  ],
  declarations: [
    UserChangePasswordComponent
  ],
  exports: [
    UserChangePasswordComponent
  ]
})

export class SidebarUserChangePasswordModule {}
