import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

import { SynthesisListComponent } from './synthesis-list.component';

import { MessageTemplate1Module } from '../../../../utility-components/messages/message-template-1/message-template-1.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    MessageTemplate1Module
  ],
  declarations: [
    SynthesisListComponent
  ],
  exports: [
    SynthesisListComponent
  ]
})

export class SynthesisListModule {}
