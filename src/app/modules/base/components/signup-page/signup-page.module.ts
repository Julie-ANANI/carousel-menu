import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SignupPageComponent } from './signup-page.component';
import { SidebarModule } from '../../../sidebar/sidebar.module';
import { SidebarSignupFormModule } from '../../../sidebar/components/signup-form/sidebar-signup-form.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TranslateModule.forChild(),
    ReactiveFormsModule,
    SidebarSignupFormModule,
    SidebarModule
  ],
  declarations: [
    SignupPageComponent
  ],
  exports: [
    SignupPageComponent
  ]
})

export class SignupPageModule {}
