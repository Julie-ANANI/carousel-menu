import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InputListComponent } from './input-list.component';

import { PipeModule } from '../../../pipe/pipe.module';
import {NguiAutoCompleteModule} from '../auto-complete/auto-complete.module';
import {ModalModule} from '@umius/umi-common-component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    PipeModule,
    NguiAutoCompleteModule,
    ModalModule
  ],
  declarations: [
    InputListComponent
  ],
  exports: [
    InputListComponent
  ]
})

export class InputListModule {}
