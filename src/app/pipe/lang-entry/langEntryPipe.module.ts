import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {LangEntryPipe} from './lang-entry.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    LangEntryPipe,
  ],
  exports: [
    LangEntryPipe
  ]
})

export class LangEntryPipeModule {}
