import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { ResetPasswordComponent } from './reset-password.component';

import { UserService } from '../../../../../services/user/user.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TranslateModule.forChild(),
    ReactiveFormsModule,
  ],
  declarations: [
    ResetPasswordComponent
  ],
  exports: [
    ResetPasswordComponent
  ],
  providers: [
    UserService
  ]
})

export class ResetPasswordModule {}
