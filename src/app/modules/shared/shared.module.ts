import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterializeModule} from 'angular2-materialize';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {HttpModule} from '@angular/http';
import {TranslateModule} from '@ngx-translate/core';
import {DragulaModule} from 'ng2-dragula';
import {NgPipesModule} from 'ngx-pipes';
import {FileUploadModule} from 'ng2-file-upload';
import {FormErrorDirective} from '../../utils/dynamic-form-compozer/directives/form-error/form-error.directive';
import {LogoDirective} from '../../directives/logo/logo.directive';
import {DynamicFormComponent} from '../../utils/dynamic-form-compozer/components/dynamic-form/dynamic-form.component';
import {DynamicFormQuestionComponent} from '../../utils/dynamic-form-compozer/components/dynamic-form-question/dynamic-form-question.component';
import {DynamicFormContentComponent} from '../../utils/dynamic-form-compozer/components/dynamic-form-content/dynamic-form-content.component';
import {DynamicFormHtmlComponent} from '../../utils/dynamic-form-compozer/components/dynamic-form-html/dynamic-form-html.component';
import {SharedBreadcrumbComponent} from './components/shared-breadcrumb/shared-breadcrumb.component';
import {SharedNotFoundComponent} from './components/shared-not-found/shared-not-found.component';
import {SharedUploadZonePhotoComponent} from './components/shared-upload-zone-photo/shared-upload-zone-photo.component';
import {SharedUploadZoneVideoComponent} from './components/shared-upload-zone-video/shared-upload-zone-video.component';
import {SharedPreloaderComponent} from './components/shared-preloader/shared-preloader.component';
import {SharedLoaderComponent} from './components/shared-loader/shared-loader.component';
import {SharedInnovationCardLangmodalComponent} from './components/shared-innovation-card-langmodal/shared-innovation-card-langmodal.component';


@NgModule({
  imports: [
    CommonModule,
    MaterializeModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    NgPipesModule,
    RouterModule.forChild([]), // giving no routes but needed for all <a [routerLink]=""> uses
    TranslateModule.forChild(),
    DragulaModule,
    FileUploadModule
  ],
  declarations: [
    // Directives
    FormErrorDirective,
    LogoDirective,

    // Component
    DynamicFormComponent,
    DynamicFormQuestionComponent,
    DynamicFormContentComponent,
    DynamicFormHtmlComponent,

    SharedBreadcrumbComponent,
    SharedNotFoundComponent,
    SharedUploadZonePhotoComponent,
    SharedUploadZoneVideoComponent,
    SharedPreloaderComponent,
    SharedLoaderComponent,
    SharedInnovationCardLangmodalComponent
  ],
  exports: [
    // Modules
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    DragulaModule,

    // Directives
    FormErrorDirective,
    LogoDirective,

    // Components
    DynamicFormComponent,
    DynamicFormQuestionComponent,
    DynamicFormContentComponent,
    DynamicFormHtmlComponent,

    SharedBreadcrumbComponent,
    SharedNotFoundComponent,
    SharedUploadZonePhotoComponent,
    SharedUploadZoneVideoComponent,
    SharedPreloaderComponent,
    SharedLoaderComponent,
    SharedInnovationCardLangmodalComponent

  ]
})
export class SharedModule { }
