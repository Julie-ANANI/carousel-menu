import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { MessageTemplate2Component } from './message-template-2.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    MessageTemplate2Component
  ],
  exports: [
    MessageTemplate2Component
  ]
})

export class MessageTemplate2Module {}
