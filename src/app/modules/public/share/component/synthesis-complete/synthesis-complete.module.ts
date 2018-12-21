import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

import { SynthesisCompleteComponent } from './synthesis-complete.component';

import { SharedMarketReportModule } from '../../../../shared/components/shared-market-report/shared-market-report.module';
import { SharedLoaderModule } from '../../../../shared/components/shared-loader/shared-loader.module';
import { NotFoundModule } from '../../../../common/not-found/not-found.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    SharedMarketReportModule,
    SharedLoaderModule,
    NotFoundModule
  ],
  declarations: [
    SynthesisCompleteComponent
  ],
  exports: [
    SynthesisCompleteComponent
  ]
})

export class SynthesisCompleteModule {}
