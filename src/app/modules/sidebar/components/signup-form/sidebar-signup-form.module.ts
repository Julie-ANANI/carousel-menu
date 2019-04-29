import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NguiAutoCompleteModule } from '../../../utility-components/auto-complete/auto-complete.module';
import { SidebarModule } from '../../sidebar.module';
import { SignupFormComponent } from './signup-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    NguiAutoCompleteModule,
    SidebarModule,
  ],
  declarations: [
    SignupFormComponent
  ],
  exports: [
    SignupFormComponent
  ]
})

export class SidebarSignupFormModule {}
