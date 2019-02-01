import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { TagsFormComponent } from './tags-form.component';

import { SidebarModule } from '../../sidebar.module';
import { SharedTagItemModule } from '../../../shared/components/shared-tag-item/shared-tag-item.module';
import { AutocompleteInputModule } from '../../../utility-components/autocomplete-input/autocomplete-input.module';
import { PipeModule } from '../../../../pipe/pipe.module';
import { NguiAutoCompleteModule } from '../../../utility-components/auto-complete/auto-complete.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    SidebarModule,
    SharedTagItemModule,
    AutocompleteInputModule,
    PipeModule,
    NguiAutoCompleteModule,
  ],
  declarations: [
   TagsFormComponent
  ],
  exports: [
    TagsFormComponent
  ]
})

export class SidebarTagsFormModule {}
