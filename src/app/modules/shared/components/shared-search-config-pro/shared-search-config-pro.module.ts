import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedSearchConfigProComponent } from './shared-search-config-pro.component';
import { LangEntryPipeModule } from "../../../../pipe/lang-entry/langEntryPipe.module";

@NgModule({
    imports: [
        CommonModule,
        LangEntryPipeModule,
    ],
  declarations: [
    SharedSearchConfigProComponent
  ],
  exports: [
    SharedSearchConfigProComponent
  ]
})

export class SharedSearchConfigProModule { }
