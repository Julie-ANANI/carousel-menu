import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedInnovationDetailComponent } from './shared-innovation-detail.component';

import { PipeModule } from '../../../../pipe/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    PipeModule
  ],
  declarations: [
    SharedInnovationDetailComponent
  ],
  exports: [
    SharedInnovationDetailComponent
  ]
})

export class SharedInnovationDetailModule {}
