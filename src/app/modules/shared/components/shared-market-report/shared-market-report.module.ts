import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { SharedEditorTinymceModule } from '../shared-editor-tinymce/shared-editor-tinymce.module';
import { SharedWorldmapModule } from '../shared-worldmap/shared-worldmap.module';
import { PipeModule } from '../../../../pipe/pipe.module';
import { SidebarUserAnswerModule } from '../../../sidebars/components/sidebar-user-answer/sidebar-user-answer.module';
import { MessageTemplateModule } from '../../../utility/messages/message-template/message-template.module';
import { PieChartModule } from '../../../utility/canvas/piechart/pie-chart.module';

import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { BluesquareComponent } from './components/bluesquare/bluesquare.component';
import { ProfessionalTagComponent } from './components/pro-tag/pro-tag.component';
import { SharedMarketReportComponent } from './shared-market-report.component';
import { SharedMarketCommentComponent } from './components/professional-comment/professional-comment.component';
import { SharedTagsModule } from '../shared-tags/shared-tags.module';
import { QuestionConclusionComponent } from './components/question-conclusion/question-conclusion.component';
import { QuestionSectionComponent } from './components/question-section/question-section.component';
import { ScaleComponent } from './components/scale/scale.component';
import { ItemListComponent } from './components/item-list/item-list.component';
import { SharedMarketReportPopoverComponent } from './components/shared-market-report-popover/shared-market-report-popover.component';
import { StarsComponent } from './components/stars/stars.component';
import { SharedMarketComment2Component } from './components/professional-comment-2/professional-comment-2.component';
import { SidebarFilterAnswersModule } from '../../../sidebars/components/sidebar-filter-answers/sidebar-filter-answers.module';
import {SharedEditorsModule} from '../shared-editors/shared-editors.module';
import {SharedToggleListModule} from '../shared-toggle-list/shared-toggle-list.module';
import {SpinnerLoaderModule} from '../../../utility/spinner-loader/spinner-loader.module';
import {SharedColorPickerModule} from '../shared-color-picker/shared-color-picker.module';
import {RankingChartModule} from './components/ranking-chart/ranking-chart.module';
import {RanksModule} from './components/ranks/ranks.module';
import {LikertScaleChartModule} from './components/likert-scale-chart/likert-scale-chart.module';
import {CountryFlagModule, ModalModule, SidebarFullModule, SidebarInlineModule} from '@umius/umi-common-component';
import {MissionPipeModule} from '../../../../pipe/mission/missionPipe.module';
import { MarketReportResultComponent } from './components/market-report-result/market-report-result.component';
import {LangEntryPipeModule} from '../../../../pipe/lang-entry/langEntryPipe.module';

@NgModule({
  imports: [
    CommonModule,
    PipeModule,
    SharedEditorTinymceModule,
    SharedWorldmapModule,
    TranslateModule.forChild(),
    NgxPageScrollModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SidebarUserAnswerModule,
    MessageTemplateModule,
    SharedTagsModule,
    PieChartModule,
    SidebarFilterAnswersModule,
    SharedEditorsModule,
    SharedToggleListModule,
    SpinnerLoaderModule,
    SharedColorPickerModule,
    RankingChartModule,
    RanksModule,
    LikertScaleChartModule,
    SidebarInlineModule,
    ModalModule,
    SidebarFullModule,
    CountryFlagModule,
    MissionPipeModule,
    LangEntryPipeModule,
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
    MarketReportResultComponent,
  ],
  exports: [
    SharedMarketReportComponent,
    QuestionConclusionComponent
  ]
})

export class SharedMarketReportModule {}
