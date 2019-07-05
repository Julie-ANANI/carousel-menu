import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


import { TranslateModule } from '@ngx-translate/core';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { SharedTextZoneModule } from '../shared-text-zone/shared-text-zone.module';
import { SharedWorldmapModule } from '../shared-worldmap/shared-worldmap.module';
import { PipeModule } from '../../../../pipe/pipe.module';
import { SidebarModule } from '../../../sidebar/sidebar.module';
import { SharedLoaderModule } from '../shared-loader/shared-loader.module';
import { SidebarUserAnswerModule } from '../../../sidebar/components/user-answer/sidebar-user-answer.module';
import { CountryFlagModule } from '../../../utility-components/country-flag/country-flag.module';
import { MessageTemplate1Module } from '../../../utility-components/messages/message-template-1/message-template-1.module';
import { ModalModule } from '../../../utility-components/modals/modal/modal.module';
import { SharedExecutiveReportModule } from '../shared-executive-report/shared-executive-report.module';
import { PieChartModule } from '../../../utility-components/canvas/piechart/pie-chart.module';
import { SharedMainPageModule } from '../shared-main-page/shared-main-page.module';

import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { BluesquareComponent } from './components/bluesquare/bluesquare.component';
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
import { ExportModalComponent } from './components/export-modal/export-modal.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';


import { CommonService } from '../../../../services/common/common.service';
import { FilterService } from './services/filters.service';
import { ResponseService } from './services/response.service';
import { TagsFiltersService } from './services/tags-filter.service';
import { WorldmapFiltersService } from './services/worldmap-filter.service';


@NgModule({
  imports: [
    CommonModule,
    PipeModule,
    SharedTextZoneModule,
    SharedWorldmapModule,
    TranslateModule.forChild(),
    NgxPageScrollModule,
    SidebarModule,
    RouterModule,
    SharedLoaderModule,
    FormsModule,
    ReactiveFormsModule,
    SidebarUserAnswerModule,
    CountryFlagModule,
    MessageTemplate1Module,
    ModalModule,
    SharedExecutiveReportModule,
    PieChartModule,
    SharedMainPageModule
  ],
  providers: [
    CommonService,
    FilterService,
    ResponseService,
    TagsFiltersService,
    WorldmapFiltersService,

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
    SharedMarketReportPopoverComponent,
    QuestionSectionComponent,
    StarsComponent,
    ExportModalComponent,
    SidebarComponent
  ],
  exports: [
    SharedMarketReportComponent
  ]
})

export class SharedMarketReportModule {}
