import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InputListComponent } from './input-list.component';

import { PipeModule } from '../../../pipe/pipe.module';
import {ModalModule} from '../modals/modal/modal.module';
import {NguiAutoCompleteModule} from '../auto-complete/auto-complete.module';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild(),
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        PipeModule,
        ModalModule,
        NguiAutoCompleteModule
    ],
  declarations: [
    InputListComponent
  ],
  exports: [
    InputListComponent
  ]
})

export class InputListModule {}
