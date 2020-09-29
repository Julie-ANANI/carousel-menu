import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {AdminProjectSynthesisComponent} from './admin-project-synthesis.component';
import {SharedMarketReportModule} from '../../../../../shared/components/shared-market-report/shared-market-report.module';

@NgModule({
  imports: [
    CommonModule,
    SharedMarketReportModule,
  ],
  declarations: [
    AdminProjectSynthesisComponent,
  ]
})

export class AdminProjectSynthesisModule {}
