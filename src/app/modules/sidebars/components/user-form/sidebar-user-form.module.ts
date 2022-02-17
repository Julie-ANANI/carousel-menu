import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { UserFormComponent } from './user-form.component';
import { AutoCompleteInputModule } from '../../../utility/auto-complete-input/auto-complete-input.module';
import { NguiAutoCompleteModule } from '../../../utility/auto-complete/auto-complete.module';
import { SharedTagsModule } from '../../../shared/components/shared-tags/shared-tags.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    AutoCompleteInputModule,
    NguiAutoCompleteModule,
    SharedTagsModule
  ],
  declarations: [
    UserFormComponent
  ],
  exports: [
    UserFormComponent
  ]
})

export class SidebarUserFormModule {}
