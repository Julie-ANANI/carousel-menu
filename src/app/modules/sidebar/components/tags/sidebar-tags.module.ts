import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { TagsComponent } from './tags.component';

import { SidebarModule } from '../../sidebar.module';
import { SharedTagModule } from '../../../shared/components/shared-tag/shared-tag.module';
import { AutoCompleteInputModule } from '../../../utility-components/auto-complete-input/auto-complete-input.module';
import { PipeModule } from '../../../../pipe/pipe.module';
import { NguiAutoCompleteModule } from '../../../utility-components/auto-complete/auto-complete.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    SidebarModule,
    SharedTagModule,
    AutoCompleteInputModule,
    PipeModule,
    NguiAutoCompleteModule,
  ],
  declarations: [
   TagsComponent
  ],
  exports: [
    TagsComponent
  ]
})

export class SidebarTagsModule {}
