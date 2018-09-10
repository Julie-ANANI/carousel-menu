import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { RouterModule } from '@angular/router';
import { SharedTagItemComponent } from './shared-tag-item.component';
import { ModalModule } from '../shared-modal/modal.module';
import { PipeModule } from '../../../../pipe/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FormsModule,
    ModalModule,
    ReactiveFormsModule,
    Ng2AutoCompleteModule,
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
