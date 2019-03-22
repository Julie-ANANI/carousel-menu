import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { LoginComponent } from "./login.component";

import { LoginRoutingModule } from "./login-routing.module";
import { ForgetPasswordModule } from "./components/forget-password/forget-password.module";
import { ResetPasswordModule } from './components/reset-password/reset-password.module';
import { SpinnerLoaderModule } from '../../utility-components/spinner-loader/spinner-loader.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    LoginRoutingModule,
    ForgetPasswordModule,
    FormsModule,
    ReactiveFormsModule,
    ResetPasswordModule,
    SpinnerLoaderModule
  ],
  declarations: [
    LoginComponent,
  ],
  providers: [
  ]
})

export class LoginModule {}
