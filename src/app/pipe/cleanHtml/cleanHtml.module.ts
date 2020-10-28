import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {DomSanitizerPipe} from './DomSanitizer';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DomSanitizerPipe,
  ],
  exports: [
    DomSanitizerPipe
  ]
})

export class CleanHtmlModule {}
