import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

import { SynthesisCompleteComponent } from './synthesis-complete.component';

import { SharedMarketReportModule } from '../../../../shared/components/shared-market-report/shared-market-report.module';
import { MessageTemplateModule } from '../../../../utility/messages/message-template/message-template.module';
import { ProjectFrontPageModule } from '../../../../user/client/components/project-front-page/project-front-page.module';
import { SynthesisCompInnovDescModule } from './synthesis-comp-innov-desc/synthesis-comp-innov-desc.module';
import { SharedTargetingDetailModule } from '../../../../shared/components/shared-targeting-detail/shared-targeting-detail.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    SharedMarketReportModule,
    MessageTemplateModule,
    ProjectFrontPageModule,
    SynthesisCompInnovDescModule,
    SharedTargetingDetailModule,
  ],
  declarations: [
    SynthesisCompleteComponent
  ],
  exports: [
    SynthesisCompleteComponent
  ]
})

export class SynthesisCompleteModule {}
