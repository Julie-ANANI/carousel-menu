import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { MessageSpaceComponent } from './message-space.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    MessageSpaceComponent
  ],
  exports: [
    MessageSpaceComponent
  ]
})

export class MessageSpaceModule {}
