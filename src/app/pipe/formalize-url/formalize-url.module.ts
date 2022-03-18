import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {FormalizeUrlPipe} from './formalize-url.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    FormalizeUrlPipe,
  ],
  exports: [
    FormalizeUrlPipe
  ]
})

export class FormalizeUrlModule {}
