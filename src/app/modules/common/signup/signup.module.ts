import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from "./signup.component";
import { SignupRoutingModule } from "./signup-routing.module";
import { TranslateModule } from '@ngx-translate/core';
import { SidebarModule } from '../../sidebars/templates/sidebar/sidebar.module';
import { SidebarSignupFormModule } from '../../sidebars/components/sidebar-signup-form/sidebar-signup-form.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    SignupRoutingModule,
    SidebarModule,
    SidebarSignupFormModule
  ],
  declarations: [
    SignupComponent
  ]
})

export class SignupModule {}
