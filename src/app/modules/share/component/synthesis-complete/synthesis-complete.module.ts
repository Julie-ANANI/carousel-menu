import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SynthesisCompleteComponent } from './synthesis-complete.component';
import { RouterModule } from '@angular/router';
import { SharedMarketReportModule } from '../../../shared/components/shared-market-report/shared-market-report.module';
import { SharedLoaderModule } from '../../../shared/components/shared-loader/shared-loader.module';
import { NotFoundPageModule } from '../../../base/components/not-found-page/not-found-page.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    SharedMarketReportModule,
    SharedLoaderModule,
    NotFoundPageModule
  ],
  declarations: [
    SynthesisCompleteComponent
  ],
  exports: [
    SynthesisCompleteComponent
  ]
})

export class SynthesisCompleteModule {}
