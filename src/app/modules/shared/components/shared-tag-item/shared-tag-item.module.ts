import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NguiAutoCompleteModule } from '../../../utility-components/auto-complete/auto-complete.module';
import { RouterModule } from '@angular/router';
import { SharedTagItemComponent } from './shared-tag-item.component';
import { ModalModule } from '../../../utility-components/modals/modal/modal.module';
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
    SharedTagItemComponent
  ],
  exports: [
    SharedTagItemComponent
  ]
})

export class SharedTagItemModule { }
