import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SignupPageComponent } from './signup-page.component';
import { SidebarUserFormModule } from '../../../sidebar/components/user-form/sidebar-user-form.module';
import { SidebarModule } from '../../../sidebar/sidebar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TranslateModule.forChild(),
    ReactiveFormsModule,
    SidebarUserFormModule,
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
