import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { MessageErrorComponent } from './message-error.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild()
  ],
  declarations: [
    MessageErrorComponent
  ],
  exports: [
    MessageErrorComponent
  ]
})

export class MessageErrorModule {}
