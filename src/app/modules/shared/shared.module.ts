import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { TranslateModule } from '@ngx-translate/core';
import { DragulaModule } from 'ng2-dragula';
import { NgPipesModule } from 'ngx-pipes';
import { FileUploadModule } from 'ng2-file-upload';
import { FormErrorDirective } from '../../../../.toreview/dynamic-form-compozer/directives/form-error/form-error.directive';
import { DynamicFormComponent } from '../../../../.toreview/dynamic-form-compozer/components/dynamic-form/dynamic-form.component';
import { DynamicFormQuestionComponent } from '../../../../.toreview/dynamic-form-compozer/components/dynamic-form-question/dynamic-form-question.component';
import { DynamicFormContentComponent } from '../../../../.toreview/dynamic-form-compozer/components/dynamic-form-content/dynamic-form-content.component';
import { DynamicFormHtmlComponent } from '../../../../.toreview/dynamic-form-compozer/components/dynamic-form-html/dynamic-form-html.component';
import { SharedNotFoundComponent } from './components/shared-not-found/shared-not-found.component';
import { SharedUploadZonePhotoComponent } from './components/shared-upload-zone-photo/shared-upload-zone-photo.component';
import { SharedUploadZoneVideoComponent } from './components/shared-upload-zone-video/shared-upload-zone-video.component';
import { SharedPreloaderComponent } from './components/shared-preloader/shared-preloader.component';
import { SharedLoaderComponent } from './components/shared-loader/shared-loader.component';
import { SharedMarketReportComponent } from './components/shared-market-report/shared-market-report-module';
import { SharedBarChartComponent } from './components/shared-bar-chart-component/shared-bar-chart.component';
import { SharedMarketItemComponent } from './components/shared-market-item-component/shared-market-item.component';
import { SharedMarketCommentComponent } from './components/shared-market-comment-component/shared-market-comment.component';
import { SharedMarketReportPopoverComponent } from './components/shared-market-report-popover/shared-market-report-popover.component';
import { SharedPricesComponent } from './components/shared-prices-component/shared-prices.component';
import { SharedWorldMapComponent } from './components/shared-world-map-component/shared-world-map.component';
import { SharedPaginationComponent } from './components/shared-pagination/shared-pagination.component';
import { SharedFilterInputComponent } from './components/shared-filter-input/shared-filter-input.component';
import { SqSortDirective } from '../../directives/smart-query/sqSort.directive';
import { ChartsModule } from 'ng2-charts';
import { Ng2PageScrollModule } from 'ng2-page-scroll';
import { SharedTextZoneComponent } from './components/shared-text-zone/shared-text-zone.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    NgPipesModule,
    RouterModule.forChild([]), // giving no routes but needed for all <a [routerLink]=''> uses
    TranslateModule.forChild(),
    DragulaModule,
    ChartsModule,
    FileUploadModule,
    Ng2PageScrollModule
  ],
  declarations: [
    // Directives
    FormErrorDirective,
    SqSortDirective,

    // Component
    DynamicFormComponent,
    DynamicFormQuestionComponent,
    DynamicFormContentComponent,
    DynamicFormHtmlComponent,

    SharedNotFoundComponent,
    SharedUploadZonePhotoComponent,
    SharedUploadZoneVideoComponent,
    SharedPreloaderComponent,
    SharedLoaderComponent,
    SharedMarketReportComponent,
    SharedBarChartComponent,
    SharedMarketItemComponent,
    SharedMarketCommentComponent,
    SharedMarketReportPopoverComponent,
    SharedPricesComponent,
    SharedWorldMapComponent,
    SharedPaginationComponent,
    SharedFilterInputComponent,
    SharedTextZoneComponent
  ],
  exports: [
    // Modules
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    DragulaModule,
    Ng2PageScrollModule,

    // Directives
    FormErrorDirective,
    SqSortDirective,

    // Components
    DynamicFormComponent,
    DynamicFormQuestionComponent,
    DynamicFormContentComponent,
    DynamicFormHtmlComponent,

    SharedNotFoundComponent,
    SharedUploadZonePhotoComponent,
    SharedUploadZoneVideoComponent,
    SharedPreloaderComponent,
    SharedLoaderComponent,
    SharedPaginationComponent,
    SharedFilterInputComponent,
    SharedMarketReportComponent

  ]
})
export class SharedModule { }
