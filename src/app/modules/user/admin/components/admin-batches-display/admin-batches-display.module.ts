import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { AdminBatchesDisplayComponent } from './admin-batches-display.component';

import { PipeModule } from '../../../../../pipe/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    PipeModule
  ],
  declarations: [
    AdminBatchesDisplayComponent
  ],
  exports: [
    AdminBatchesDisplayComponent
  ]
})

export class AdminBatchesDisplayModule {}
