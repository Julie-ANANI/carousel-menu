import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ModalMediaComponent } from './modal-media.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    ModalMediaComponent
  ],
  exports: [
    ModalMediaComponent
  ]
})

export class ModalMediaModule { }
