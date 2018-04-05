import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ChartsModule } from 'ng2-charts';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { BluesquareComponent } from './components/bluesquare/bluesquare.component';
import { PiechartComponent } from './components/piechart/piechart.component';
import { PricesComponent } from './components/prices/prices.component';
import { ProfessionalTagComponent } from './components/pro-tag/pro-tag.component';
import { SharedMarketReportComponent } from './shared-market-report.component';
import { SharedMarketCommentComponent } from './components/professional-comment/professional-comment.component';
import { QuestionConclusionComponent } from './components/question-conclusion/question-conclusion.component';
import { QuestionSectionComponent } from './components/question-section/question-section.component';
import { ScaleComponent } from './components/scale/scale.component';
import { SharedMarketItemComponent } from './components/shared-market-item-component/shared-market-item.component';
import { SharedMarketItemListComponent } from './components/shared-market-item-list-component/shared-market-item-list.component';
import { SharedMarketReportPopoverComponent } from './components/shared-market-report-popover/shared-market-report-popover.component';
import { StarsComponent } from './components/stars/stars.component';
import { WorldMapComponent } from './components/world-map/world-map.component';
import { MultilingModule } from '../../../../pipes/multiling/multiling.module';
import { SharedModule } from '../../shared.module';
import { SharedAnswerModalModule } from '../shared-answer-modal/answer-modal.module';
import { CommonService } from '../../../../services/common/common.service';

@NgModule({
  imports: [
    CommonModule,
    ChartsModule,
    MultilingModule,
    SharedModule,
    SharedAnswerModalModule,
    TranslateModule.forChild()
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
    SharedMarketItemComponent,
    SharedMarketItemListComponent,
    BluesquareComponent,
    PiechartComponent,
    SharedMarketReportPopoverComponent,
    QuestionSectionComponent,
    PricesComponent,
    StarsComponent,
    WorldMapComponent
  ],
  exports: [
    SharedMarketReportComponent
  ]
})

export class SharedMarketReportModule {}
