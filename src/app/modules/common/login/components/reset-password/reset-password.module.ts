import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { ResetPasswordComponent } from './reset-password.component';
import {ResetPasswordRoutingModule} from './reset-password-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TranslateModule.forChild(),
    ReactiveFormsModule,
    ResetPasswordRoutingModule
  ],
  declarations: [
    ResetPasswordComponent
  ],
  exports: [
    ResetPasswordComponent
  ]
})

export class ResetPasswordModule {}
