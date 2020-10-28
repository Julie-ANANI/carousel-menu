import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedActivityModalComponent } from './shared-activity-modal.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild()
  ],
  declarations: [
    SharedActivityModalComponent
  ],
  exports: [
    SharedActivityModalComponent
  ]
})

export class SharedActivityModalModule { }
