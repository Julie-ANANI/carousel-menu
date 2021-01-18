import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { SharedEditorTinymceModule } from '../shared-editor-tinymce/shared-editor-tinymce.module';
import { SharedWorldmapModule } from '../shared-worldmap/shared-worldmap.module';
import { PipeModule } from '../../../../pipe/pipe.module';
import { SidebarModule } from '../../../sidebars/templates/sidebar/sidebar.module';
import { SharedLoaderModule } from '../shared-loader/shared-loader.module';
import { SidebarUserAnswerModule } from '../../../sidebars/components/sidebar-user-answer/sidebar-user-answer.module';
import { CountryFlagModule } from '../../../utility/country-flag/country-flag.module';
import { MessageTemplateModule } from '../../../utility/messages/message-template/message-template.module';
import { ModalModule } from '../../../utility/modals/modal/modal.module';
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

import { SidebarLeftModule } from "../../../sidebars/templates/sidebar-left/sidebar-left.module";
import { SidebarInPageModule } from '../../../sidebars/templates/sidebar-in-page/sidebar-in-page.module';
import { SidebarFilterAnswersModule } from '../../../sidebars/components/sidebar-filter-answers/sidebar-filter-answers.module';
import {SharedEditorsModule} from '../shared-editors/shared-editors.module';
import {SharedToggleListModule} from '../shared-toggle-list/shared-toggle-list.module';
import {SpinnerLoaderModule} from '../../../utility/spinner-loader/spinner-loader.module';

@NgModule({
    imports: [
        CommonModule,
        PipeModule,
        SharedEditorTinymceModule,
        SharedWorldmapModule,
        TranslateModule.forChild(),
        NgxPageScrollModule,
        SidebarModule,
        SidebarLeftModule,
        RouterModule,
        SharedLoaderModule,
        FormsModule,
        ReactiveFormsModule,
        SidebarUserAnswerModule,
        CountryFlagModule,
        MessageTemplateModule,
        ModalModule,
        SharedTagsModule,
        PieChartModule,
        SidebarInPageModule,
        SidebarFilterAnswersModule,
        SharedEditorsModule,
        SharedToggleListModule,
        SpinnerLoaderModule
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
  ],
  exports: [
    SharedMarketReportComponent
  ]
})

export class SharedMarketReportModule {}
