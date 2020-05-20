import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { PrintExecutiveReportRoutingModule } from './print-executive-report-routing.module';

import { PrintExecutiveReportComponent } from './print-executive-report.component';
import { ReportConclusionComponent } from './report/report-conclusion/report-conclusion.component';
import { ReportProfessionalComponent } from './report/report-professional/report-professional.component';
import { ReportSectionComponent } from './report/report-section/report-section.component';
import { ReportComponent } from './report/report.component';

import { ProjectFrontPageModule } from '../../user/client/components/project-front-page/project-front-page.module';
import { SharedWorldmapModule } from '../../shared/components/shared-worldmap/shared-worldmap.module';
import { CountryFlagModule } from '../../utility/country-flag/country-flag.module';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { ChartsModule } from 'ng2-charts';
import { PieChartModule } from '../../utility/canvas/piechart/pie-chart.module';
import { PipeModule } from '../../../pipe/pipe.module';
import { PiechartExecutiveModule } from '../../utility/canvas/piechart-executive/piechart-executive.module';
import { ProgressBarModule } from '../../utility/progress-bar/progress-bar.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    RouterModule,
    PrintExecutiveReportRoutingModule,
    ProjectFrontPageModule,
    SharedWorldmapModule,
    CountryFlagModule,
    NgxPageScrollModule,
    ChartsModule,
    PieChartModule,
    PipeModule,
    PiechartExecutiveModule,
    ProgressBarModule
  ],
  declarations: [
    PrintExecutiveReportComponent,
    ReportConclusionComponent,
    ReportProfessionalComponent,
    ReportSectionComponent,
    ReportComponent
  ],
  exports: [
    PrintExecutiveReportComponent
  ]
})

export class PrintExecutiveReportModule {}
