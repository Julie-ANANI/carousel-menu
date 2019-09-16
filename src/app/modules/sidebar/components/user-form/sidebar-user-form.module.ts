import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { UserFormComponent } from './user-form.component';
import { AutoCompleteInputModule } from '../../../utility-components/auto-complete-input/auto-complete-input.module';
import { NguiAutoCompleteModule } from '../../../utility-components/auto-complete/auto-complete.module';
import { SharedTagModule } from '../../../shared/components/shared-tag/shared-tag.module';
import { SidebarModule } from '../../sidebar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    AutoCompleteInputModule,
    NguiAutoCompleteModule,
    SharedTagModule,
    SidebarModule
  ],
  declarations: [
    UserFormComponent
  ],
  exports: [
    UserFormComponent
  ]
})

export class SidebarUserFormModule {}
