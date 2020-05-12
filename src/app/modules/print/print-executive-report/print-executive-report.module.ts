import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { PrintExecutiveReportRoutingModule } from './print-executive-report-routing.module';

import { PrintExecutiveReportComponent } from './print-executive-report.component';

import { ProjectFrontPageModule } from '../../user/client/components/project-front-page/project-front-page.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    RouterModule,
    PrintExecutiveReportRoutingModule,
    ProjectFrontPageModule
  ],
  declarations: [
    PrintExecutiveReportComponent
  ],
  exports: [
    PrintExecutiveReportComponent
  ]
})

export class PrintExecutiveReportModule {}
