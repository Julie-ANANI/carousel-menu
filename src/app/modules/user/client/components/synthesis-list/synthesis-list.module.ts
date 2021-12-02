import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

import { SynthesisListComponent } from './synthesis-list.component';

import { MessageTemplateModule } from '../../../../utility/messages/message-template/message-template.module';
import {SynthesisListRoutingModule} from './synthesis-list-routing.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    MessageTemplateModule,
    SynthesisListRoutingModule
  ],
  declarations: [
    SynthesisListComponent
  ],
  exports: [
    SynthesisListComponent
  ]
})

export class SynthesisListModule {}
