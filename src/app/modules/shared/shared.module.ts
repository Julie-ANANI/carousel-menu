import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { TranslateModule } from '@ngx-translate/core';
import { FileUploadModule } from 'ng2-file-upload';
// import { FormErrorDirective } from '../../../../.toreview/dynamic-form-compozer/directives/form-error/form-error.directive';
// import { DynamicFormComponent } from '../../../../.toreview/dynamic-form-compozer/components/dynamic-form/dynamic-form.component';
// import { DynamicFormQuestionComponent } from '../../../../.toreview/dynamic-form-compozer/components/dynamic-form-question/dynamic-form-question.component';
// import { DynamicFormContentComponent } from '../../../../.toreview/dynamic-form-compozer/components/dynamic-form-content/dynamic-form-content.component';
// import { DynamicFormHtmlComponent } from '../../../../.toreview/dynamic-form-compozer/components/dynamic-form-html/dynamic-form-html.component';
import { SharedNotFoundComponent } from './components/shared-not-found/shared-not-found.component';
import { SharedUploadZonePhotoComponent } from './components/shared-upload-zone-photo/shared-upload-zone-photo.component';
import { SharedUploadZoneVideoComponent } from './components/shared-upload-zone-video/shared-upload-zone-video.component';
import { SharedLoaderComponent } from './components/shared-loader/shared-loader.component';
import { SharedHeaderComponent } from './components/shared-header/shared-header.component';
import { SharedMarketReportComponent } from './components/shared-market-report/shared-market-report/shared-market-report-module';
import { SharedBarChartComponent } from './components/shared-bar-chart-component/shared-bar-chart.component';
import { SharedMarketItemComponent } from './components/shared-market-report/shared-market-item-component/shared-market-item.component';
import { SharedMarketItemListComponent } from './components/shared-market-report/shared-market-item-list-component/shared-market-item-list.component';
import { SharedMarketReportSectionComponent } from './components/shared-market-report/shared-market-report-section/shared-market-report-section.component';
import { SharedMarketReportPiechartComponent } from './components/shared-market-report/shared-market-report-piechart/shared-market-report-piechart.component';
import { SharedMarketReportBluesquareComponent } from './components/shared-market-report/shared-market-report-bluesquare/shared-market-report-bluesquare.component';
import { SharedMarketCommentComponent } from './components/shared-market-report/shared-market-comment-component/shared-market-comment.component';
import { SharedMarketReportPopoverComponent } from './components/shared-market-report/shared-market-report-popover/shared-market-report-popover.component';
import { SharedMarketReportModalComponent } from './components/shared-market-report/shared-market-report-modal/shared-market-report-modal.component';
import { SharedPricesComponent } from './components/shared-market-report/shared-prices-component/shared-prices.component';
import { SharedWorldMapComponent } from './components/shared-market-report/shared-world-map-component/shared-world-map.component';
import { SharedPaginationComponent } from './components/shared-pagination/shared-pagination.component';
import { SharedFilterInputComponent } from './components/shared-filter-input/shared-filter-input.component';
import { SqSortDirective } from '../../directives/smart-query/sqSort.directive';
import { SqResetDirective } from '../../directives/smart-query/sqReset.directive';
import { SharedModalComponent } from './components/shared-modal-component/shared-modal.component';
import { SharedStarsComponent } from './components/shared-stars-component/shared-stars.component';
import { ChartsModule } from 'ng2-charts';
import { SharedTextZoneComponent } from './components/shared-text-zone/shared-text-zone.component';
import { SharedProjectDescriptionComponent } from './components/shared-project-description/shared-project-description.component';
import { Ng2FileDropModule } from 'ng2-file-drop';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome'
import { Ng2PageScrollModule } from 'ng2-page-scroll';

import { SharedLatexManagerComponent } from './components/shared-latex-manager/shared-latex-manager.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    RouterModule.forChild([]), // giving no routes but needed for all <a [routerLink]=''> uses
    TranslateModule.forChild(),
    ChartsModule,
    FileUploadModule,
    Ng2FileDropModule,
    Angular2FontawesomeModule,
    Ng2PageScrollModule
  ],
  declarations: [
    // Directives
    // FormErrorDirective,
    SqSortDirective,
    SqResetDirective,

    // Component
    // DynamicFormComponent,
    // DynamicFormQuestionComponent,
    // DynamicFormContentComponent,
    // DynamicFormHtmlComponent,

    SharedNotFoundComponent,
    SharedUploadZonePhotoComponent,
    SharedUploadZoneVideoComponent,
    SharedLoaderComponent,
    SharedHeaderComponent,
    SharedMarketReportComponent,
    SharedBarChartComponent,
    SharedMarketItemComponent,
    SharedMarketCommentComponent,
    SharedMarketReportPopoverComponent,
    SharedMarketReportModalComponent,
    SharedMarketReportSectionComponent,
    SharedMarketReportPiechartComponent,
    SharedMarketItemListComponent,
    SharedMarketReportBluesquareComponent,
    SharedPricesComponent,
    SharedWorldMapComponent,
    SharedPaginationComponent,
    SharedFilterInputComponent,
    SharedTextZoneComponent,
    SharedModalComponent,
    SharedStarsComponent,
    SharedProjectDescriptionComponent,
    SharedLatexManagerComponent
  ],
  exports: [
    // Modules
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    Ng2FileDropModule,

    // Directives
    // FormErrorDirective,
    SqSortDirective,
    SqResetDirective,

    // Components
    // DynamicFormComponent,
    // DynamicFormQuestionComponent,
    // DynamicFormContentComponent,
    // DynamicFormHtmlComponent,

    SharedNotFoundComponent,
    SharedUploadZonePhotoComponent,
    SharedUploadZoneVideoComponent,
    SharedLoaderComponent,
    SharedHeaderComponent,
    SharedPaginationComponent,
    SharedFilterInputComponent,
    SharedMarketReportComponent,
    SharedModalComponent,
    SharedProjectDescriptionComponent
  ]
})
export class SharedModule { }
