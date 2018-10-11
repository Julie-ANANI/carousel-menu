import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/***
 * Services
 */
import { CommonService } from '../../../../services/common/common.service';
import { FilterService } from './services/filters.service';


/***
 * Modules
 */
import { TranslateModule } from '@ngx-translate/core';
import { ChartsModule } from 'ng2-charts';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { SharedTextZoneModule } from '../shared-text-zone/shared-text-zone.module';
import { SharedWorldmapModule } from '../shared-worldmap/shared-worldmap.module';
import { PipeModule } from '../../../../pipe/pipe.module';
import { SidebarModule } from '../../../sidebar/sidebar.module';
import { RouterModule } from '@angular/router';
import { ProgressBarModule } from '../../../input/component/progress-bar/progress-bar.module';
import { InputModule } from '../../../input/input.module';
import { SharedLoaderModule } from '../shared-loader/shared-loader.module';
import { FormsModule } from '@angular/forms';


/***
 * Components
 */
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { BluesquareComponent } from './components/bluesquare/bluesquare.component';
import { PiechartComponent } from './components/piechart/piechart.component';
import { ProfessionalTagComponent } from './components/pro-tag/pro-tag.component';
import { SharedMarketReportComponent } from './shared-market-report.component';
import { SharedMarketCommentComponent } from './components/professional-comment/professional-comment.component';
import { QuestionConclusionComponent } from './components/question-conclusion/question-conclusion.component';
import { QuestionSectionComponent } from './components/question-section/question-section.component';
import { ScaleComponent } from './components/scale/scale.component';
import { ItemListComponent } from './components/item-list/item-list.component';
import { SharedMarketReportPopoverComponent } from './components/shared-market-report-popover/shared-market-report-popover.component';
import { StarsComponent } from './components/stars/stars.component';
import { SharedMarketComment2Component } from './components/professional-comment-2/professional-comment-2.component';
import { ExecutiveReportComponent } from './components/executive-report/executive-report.component';
import { ExecutiveConclusionComponent } from './components/executive-report/executive-conclusion/executive-conclusion.component';
import { ExecutiveProfessionalComponent } from './components/executive-report/executive-professional/executive-professional.component';


@NgModule({
  imports: [
    CommonModule,
    ChartsModule,
    PipeModule,
    SharedTextZoneModule,
    SharedWorldmapModule,
    TranslateModule.forChild(),
    NgxPageScrollModule,
    SidebarModule,
    InputModule,
    RouterModule,
    ProgressBarModule,
    SharedLoaderModule,
    FormsModule
  ],
  providers: [
    CommonService,
    FilterService
  ],
  declarations: [
    SharedMarketReportComponent,
    QuestionConclusionComponent,
    BarChartComponent,
    ProfessionalTagComponent,
    ScaleComponent,
    SharedMarketCommentComponent,
    SharedMarketComment2Component,
    ItemListComponent,
    BluesquareComponent,
    PiechartComponent,
    SharedMarketReportPopoverComponent,
    QuestionSectionComponent,
    StarsComponent,
    ExecutiveReportComponent,
    ExecutiveConclusionComponent,
    ExecutiveProfessionalComponent,
  ],
  exports: [
    SharedMarketReportComponent
  ]
})

export class SharedMarketReportModule {}
