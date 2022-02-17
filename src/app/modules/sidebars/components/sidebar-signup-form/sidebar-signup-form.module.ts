import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NguiAutoCompleteModule } from '../../../utility/auto-complete/auto-complete.module';
import { SidebarSignupFormComponent } from './sidebar-signup-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    NguiAutoCompleteModule
  ],
  declarations: [
    SidebarSignupFormComponent
  ],
  exports: [
    SidebarSignupFormComponent
  ]
})

export class SidebarSignupFormModule {}
