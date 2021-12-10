import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import {AdminProjectDoneModalComponent} from './admin-project-done-modal.component';
import {ModalEmptyModule} from '../../../../utility/modals/modal-empty/modal-empty.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    ModalEmptyModule
  ],
  declarations: [
    AdminProjectDoneModalComponent
  ],
  exports: [
    AdminProjectDoneModalComponent
  ]
})

export class AdminProjectDoneModule {}
