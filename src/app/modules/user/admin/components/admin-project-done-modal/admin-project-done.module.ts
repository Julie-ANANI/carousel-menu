import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import {AdminProjectDoneModalComponent} from './admin-project-done-modal.component';
import {ModalModule} from '@umius/umi-common-component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    ModalModule
  ],
  declarations: [
    AdminProjectDoneModalComponent
  ],
  exports: [
    AdminProjectDoneModalComponent
  ]
})

export class AdminProjectDoneModule {}
