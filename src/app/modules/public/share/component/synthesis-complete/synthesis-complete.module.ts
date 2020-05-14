import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

import { SynthesisCompleteComponent } from './synthesis-complete.component';

import { SharedMarketReportModule } from '../../../../shared/components/shared-market-report/shared-market-report.module';
import { MessageTemplate1Module } from '../../../../utility/messages/message-template-1/message-template-1.module';
import { ProjectFrontPageModule } from '../../../../user/client/components/project-front-page/project-front-page.module';
import { SharedInnovationDetailModule } from '../../../../shared/components/shared-innovation-detail/shared-innovation-detail.module';
import { SharedTargetingDetailModule } from '../../../../shared/components/shared-targeting-detail/shared-targeting-detail.module';

import { TagsService } from '../../../../../services/tags/tags.service';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    SharedMarketReportModule,
    MessageTemplate1Module,
    ProjectFrontPageModule,
    SharedInnovationDetailModule,
    SharedTargetingDetailModule,
  ],
  declarations: [
    SynthesisCompleteComponent
  ],
  providers: [
    TagsService
  ],
  exports: [
    SynthesisCompleteComponent
  ]
})

export class SynthesisCompleteModule {}
