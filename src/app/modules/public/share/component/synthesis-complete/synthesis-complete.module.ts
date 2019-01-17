import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

import { SynthesisCompleteComponent } from './synthesis-complete.component';

import { SharedMarketReportModule } from '../../../../shared/components/shared-market-report/shared-market-report.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    SharedMarketReportModule
  ],
  declarations: [
    SynthesisCompleteComponent
  ],
  exports: [
    SynthesisCompleteComponent
  ]
})

export class SynthesisCompleteModule {}
