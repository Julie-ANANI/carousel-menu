import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

import { SynthesisListComponent } from './synthesis-list.component';

import { MessageTemplateModule } from '../../../../utility/messages/message-template/message-template.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    MessageTemplateModule
  ],
  declarations: [
    SynthesisListComponent
  ],
  exports: [
    SynthesisListComponent
  ]
})

export class SynthesisListModule {}
