import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ForgetPasswordComponent } from './forget-password.component';
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
    ForgetPasswordComponent
  ],
  exports: [
    ForgetPasswordComponent
  ],
  providers: [
    UserService
  ]
})

export class ForgetPasswordModule {}
