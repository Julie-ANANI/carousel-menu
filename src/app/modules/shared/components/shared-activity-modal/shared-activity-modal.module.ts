import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedActivityModalComponent } from './shared-activity-modal.component';
import {ModalModule} from '../../../utility/modals/modal/modal.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    ModalModule,
  ],
  declarations: [
    SharedActivityModalComponent
  ],
  exports: [
    SharedActivityModalComponent
  ]
})

export class SharedActivityModalModule { }
