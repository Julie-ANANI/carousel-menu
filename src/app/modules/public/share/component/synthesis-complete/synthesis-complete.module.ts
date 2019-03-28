import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

import { SynthesisCompleteComponent } from './synthesis-complete.component';

import { SharedMarketReportModule } from '../../../../shared/components/shared-market-report/shared-market-report.module';
import { MessageSpaceModule } from '../../../../utility-components/message-space/message-space.module';
import { SpinnerLoaderModule } from '../../../../utility-components/spinner-loader/spinner-loader.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    SharedMarketReportModule,
    MessageSpaceModule,
    SpinnerLoaderModule
  ],
  declarations: [
    SynthesisCompleteComponent
  ],
  exports: [
    SynthesisCompleteComponent
  ]
})

export class SynthesisCompleteModule {}
