import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ForgetPasswordComponent } from './forget-password.component';
import {ForgetPasswordRoutingModule} from './forget-password-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TranslateModule.forChild(),
    ReactiveFormsModule,
    ForgetPasswordRoutingModule
  ],
  declarations: [
    ForgetPasswordComponent
  ],
  exports: [
    ForgetPasswordComponent
  ]
})

export class ForgetPasswordModule {}
