import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

import { ExecutiveConclusionComponent } from './executive-conclusion/executive-conclusion.component';
import { ExecutiveProfessionalComponent } from './executive-professional/executive-professional.component';
import { ExecutiveSectionComponent } from './executive-section/executive-section.component';
import { SharedExecutiveReportComponent } from './shared-executive-report.component';
import { TagComponent } from './executive-section/tag/tag.component';
import { StarsComponent } from './executive-section/stars/stars.component';
import { PieChartComponent } from './executive-section/pie-chart/pie-chart.component';
import { BarChartComponent } from './executive-section/bar-chart/bar-chart.component';

import { PipeModule } from '../../../../pipe/pipe.module';
import { SharedWorldmapModule } from '../shared-worldmap/shared-worldmap.module';
import { CountryFlagModule } from '../../../utility-components/country-flag/country-flag.module';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    PipeModule,
    RouterModule,
    SharedWorldmapModule,
    CountryFlagModule,
    NgxPageScrollModule,
    ChartsModule
  ],
  declarations: [
    ExecutiveConclusionComponent,
    ExecutiveProfessionalComponent,
    ExecutiveSectionComponent,
    SharedExecutiveReportComponent,
    TagComponent,
    StarsComponent,
    PieChartComponent,
    BarChartComponent
  ],
  exports: [
    SharedExecutiveReportComponent
  ]
})

export class SharedExecutiveReportModule {}
