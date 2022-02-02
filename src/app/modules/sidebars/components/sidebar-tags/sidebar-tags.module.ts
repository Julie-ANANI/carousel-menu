import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SidebarTagsComponent } from './sidebar-tags.component';

import { SharedTagsModule } from '../../../shared/components/shared-tags/shared-tags.module';
import { AutoCompleteInputModule } from '../../../utility/auto-complete-input/auto-complete-input.module';
import { PipeModule } from '../../../../pipe/pipe.module';
import { NguiAutoCompleteModule } from '../../../utility/auto-complete/auto-complete.module';
import {LangEntryPipeModule} from '../../../../pipe/lang-entry/langEntryPipe.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
        SharedTagsModule,
        AutoCompleteInputModule,
        PipeModule,
        NguiAutoCompleteModule,
        LangEntryPipeModule,
    ],
  declarations: [
   SidebarTagsComponent
  ],
  exports: [
    SidebarTagsComponent
  ]
})

export class SidebarTagsModule {}
