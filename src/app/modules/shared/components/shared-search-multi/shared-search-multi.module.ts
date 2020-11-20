import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { PipeModule } from '../../../../pipe/pipe.module';

import { SharedSearchMultiComponent } from './shared-search-multi.component';
import {ModalEmptyModule} from '../../../utility/modals/modal-empty/modal-empty.module';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        TranslateModule.forChild(),
        PipeModule,
        ModalEmptyModule
    ],
  declarations: [
    SharedSearchMultiComponent
  ],
  exports: [
    SharedSearchMultiComponent
  ]
})

export class SharedSearchMultiModule { }
