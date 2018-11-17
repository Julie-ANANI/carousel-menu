import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from "./login.component";
import { LoginRoutingModule } from "./login-routing.module";
import { ForgetPasswordModule } from "./components/forget-password/forget-password.module";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SignupModule } from "../signup/signup.module";

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    LoginRoutingModule,
    ForgetPasswordModule,
    FormsModule,
    ReactiveFormsModule,
    SignupModule
  ],
  declarations: [
    LoginComponent,
  ],
  providers: [
  ]
})

export class LoginModule {}
