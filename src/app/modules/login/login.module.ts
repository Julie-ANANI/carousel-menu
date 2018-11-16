import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent } from "./login.component";

import { LoginRoutingModule } from "./login-routing.module";
import { ForgetPasswordModule } from "./components/forget-password-page/forget-password.module";

@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule,
    ForgetPasswordModule
  ],
  declarations: [
    LoginComponent
  ],
  providers: [

  ]
})

export class LoginModule {}
