import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';

import {CommonPipe} from './common.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CommonPipe,
  ],
  exports: [
    CommonPipe
  ],
  providers: [
    DatePipe
  ]
})

export class CommonPipeModule {}
