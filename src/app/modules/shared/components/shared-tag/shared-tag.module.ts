import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedTagComponent } from './shared-tag.component';

import { NguiAutoCompleteModule } from '../../../utility/auto-complete/auto-complete.module';
import { ModalModule } from '../../../utility/modals/modal/modal.module';
import { PipeModule } from '../../../../pipe/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FormsModule,
    ModalModule,
    ReactiveFormsModule,
    NguiAutoCompleteModule,
    RouterModule,
    PipeModule
  ],
  declarations: [
    SharedTagComponent
  ],
  exports: [
    SharedTagComponent
  ]
})

export class SharedTagModule { }
