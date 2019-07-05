import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { MessageTemplate1Component } from './message-template-1.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    MessageTemplate1Component
  ],
  exports: [
    MessageTemplate1Component
  ]
})

export class MessageTemplate1Module {}
