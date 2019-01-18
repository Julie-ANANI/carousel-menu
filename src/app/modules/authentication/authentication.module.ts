import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { AuthenticationComponent } from './authentication.component';
import { AuthenticationRoutingModule } from "./authentication-routing.module";

@NgModule({
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [
    AuthenticationComponent
  ]
})

export class AuthenticationModule {}