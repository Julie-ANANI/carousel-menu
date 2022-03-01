import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from "./signup.component";
import { SignupRoutingModule } from "./signup-routing.module";
import { TranslateModule } from '@ngx-translate/core';
import { SidebarSignupFormModule } from '../../sidebars/components/sidebar-signup-form/sidebar-signup-form.module';
import {SidebarFullModule} from '@umius/umi-common-component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    SignupRoutingModule,
    SidebarSignupFormModule,
    SidebarFullModule
  ],
  declarations: [
    SignupComponent
  ]
})

export class SignupModule {}
