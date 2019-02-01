import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SharedLoaderModule } from "../shared/components/shared-loader/shared-loader.module";

import { AuthenticationComponent } from './authentication.component';
import { AuthenticationRoutingModule } from "./authentication-routing.module";

@NgModule({
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    TranslateModule.forChild(),
    SharedLoaderModule
  ],
  declarations: [
    AuthenticationComponent
  ]
})

export class AuthenticationModule {}