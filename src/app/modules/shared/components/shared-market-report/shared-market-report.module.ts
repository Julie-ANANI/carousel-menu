import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ChartsModule } from 'ng2-charts';
import { SharedMarketReportComponent } from './shared-market-report.component';
import { QuestionConclusionComponent } from './question-conclusion/question-conclusion.component';
import { SharedBarChartComponent } from './shared-bar-chart-component/shared-bar-chart.component';
import { SharedMarketCommentComponent } from './shared-market-comment-component/shared-market-comment.component';
import { SharedMarketItemComponent } from './shared-market-item-component/shared-market-item.component';
import { SharedMarketItemListComponent } from './shared-market-item-list-component/shared-market-item-list.component';
import { SharedMarketReportBluesquareComponent } from './shared-market-report-bluesquare/shared-market-report-bluesquare.component';
import { SharedMarketReportPiechartComponent } from './shared-market-report-piechart/shared-market-report-piechart.component';
import { SharedMarketReportPopoverComponent } from './shared-market-report-popover/shared-market-report-popover.component';
import { SharedMarketReportSectionComponent } from './shared-market-report-section/shared-market-report-section.component';
import { SharedPricesComponent } from './shared-prices-component/shared-prices.component';
import { SharedWorldMapComponent } from './shared-world-map-component/shared-world-map.component';
import { SharedStarsComponent } from './shared-stars-component/shared-stars.component';
import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    ChartsModule,
    SharedModule,
    TranslateModule.forChild()
  ],
  declarations: [
    SharedMarketReportComponent,
    QuestionConclusionComponent,
    SharedBarChartComponent,
    SharedMarketCommentComponent,
    SharedMarketItemComponent,
    SharedMarketItemListComponent,
    SharedMarketReportBluesquareComponent,
    SharedMarketReportPiechartComponent,
    SharedMarketReportPopoverComponent,
    SharedMarketReportSectionComponent,
    SharedPricesComponent,
    SharedStarsComponent,
    SharedWorldMapComponent
  ],
  exports: [
    SharedMarketReportComponent
  ]
})

export class SharedMarketReportModule {}
