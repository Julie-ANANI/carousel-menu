import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ChartsModule } from 'ng2-charts';
import { SharedTextZoneModule } from '../shared-text-zone/shared-text-zone.module';
import { SidebarModule } from '../shared-sidebar/sidebar.module';
import { MultilingModule } from '../../../../pipe/pipes/multiling/multiling.module';
import { SharedWorldmapModule } from '../shared-worldmap/shared-worldmap.module';
import { SharedModule } from '../../shared.module';
import { EllipsisModule } from '../../../../pipe/pipes/ellipsis/ellipsis.module';

/* Component */
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
import { CommonService } from '../../../../services/common/common.service';


@NgModule({
  imports: [
    CommonModule,
    ChartsModule,
    EllipsisModule,
    MultilingModule,
    SharedModule,
    SharedTextZoneModule,
    SharedWorldmapModule,
    TranslateModule.forChild(),
    SidebarModule
  ],
  providers: [
    CommonService
  ],
  declarations: [
    SharedMarketReportComponent,
    QuestionConclusionComponent,
    BarChartComponent,
    ProfessionalTagComponent,
    ScaleComponent,
    SharedMarketCommentComponent,
    ItemListComponent,
    BluesquareComponent,
    PiechartComponent,
    SharedMarketReportPopoverComponent,
    QuestionSectionComponent,
    StarsComponent
  ],
  exports: [
    SharedMarketReportComponent
  ]
})

export class SharedMarketReportModule {}
