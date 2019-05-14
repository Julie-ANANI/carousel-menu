import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

import { SynthesisCompleteComponent } from './synthesis-complete.component';

import { SharedMarketReportModule } from '../../../../shared/components/shared-market-report/shared-market-report.module';
import { MessageSpaceModule } from '../../../../utility-components/message-space/message-space.module';
import { SharedMainPageModule } from '../../../../shared/components/shared-main-page/shared-main-page.module';
import { SharedInnovationDetailModule } from '../../../../shared/components/shared-innovation-detail/shared-innovation-detail.module';
import { SharedTargetingDetailModule } from '../../../../shared/components/shared-targeting-detail/shared-targeting-detail.module';
import { SharedExecutiveReportModule } from '../../../../shared/components/shared-executive-report/shared-executive-report.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    SharedMarketReportModule,
    MessageSpaceModule,
    SharedMainPageModule,
    SharedInnovationDetailModule,
    SharedTargetingDetailModule,
    SharedExecutiveReportModule
  ],
  declarations: [
    SynthesisCompleteComponent
  ],
  exports: [
    SynthesisCompleteComponent
  ]
})

export class SynthesisCompleteModule {}
