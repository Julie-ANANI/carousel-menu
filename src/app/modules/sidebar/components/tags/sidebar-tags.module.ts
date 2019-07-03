import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { TagsComponent } from './tags.component';

import { SidebarModule } from '../../sidebar.module';
import { SharedTagModule } from '../../../shared/components/shared-tag-item/shared-tag.module';
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
    SharedTagModule,
    AutocompleteInputModule,
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
