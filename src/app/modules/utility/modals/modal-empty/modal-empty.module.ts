import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalEmptyComponent } from './modal-empty.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    ModalEmptyComponent
  ],
  exports: [
    ModalEmptyComponent
  ]
})

export class ModalEmptyModule { }
