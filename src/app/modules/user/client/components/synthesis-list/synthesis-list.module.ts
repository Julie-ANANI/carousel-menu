import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

import { SynthesisListComponent } from './synthesis-list.component';

import { MessageSpaceModule } from '../../../../utility-components/messages/message-template-1/message-space.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    MessageSpaceModule
  ],
  declarations: [
    SynthesisListComponent
  ],
  exports: [
    SynthesisListComponent
  ]
})

export class SynthesisListModule {}
