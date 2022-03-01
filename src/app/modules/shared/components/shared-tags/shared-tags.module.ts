import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedTagsComponent } from './shared-tags.component';

import { NguiAutoCompleteModule } from '../../../utility/auto-complete/auto-complete.module';
import { PipeModule } from '../../../../pipe/pipe.module';
import {LangEntryPipeModule} from '../../../../pipe/lang-entry/langEntryPipe.module';
import {ModalModule} from '@umius/umi-common-component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FormsModule,
    ReactiveFormsModule,
    NguiAutoCompleteModule,
    RouterModule,
    PipeModule,
    LangEntryPipeModule,
    ModalModule
  ],
  declarations: [
    SharedTagsComponent
  ],
  exports: [
    SharedTagsComponent
  ]
})

export class SharedTagsModule { }
