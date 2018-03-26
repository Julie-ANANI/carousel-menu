// Modules externes
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { TranslateModule } from '@ngx-translate/core';
import { FileUploadModule } from 'ng2-file-upload';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { Ng2FileDropModule } from 'ng2-file-drop';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome'
import { Ng2PageScrollModule } from 'ng2-page-scroll';

// Components
import { SharedNotFoundComponent } from './components/shared-not-found/shared-not-found.component';
import { SharedUploadZonePhotoComponent } from './components/shared-upload-zone-photo/shared-upload-zone-photo.component';
import { SharedUploadZoneVideoComponent } from './components/shared-upload-zone-video/shared-upload-zone-video.component';
import { SharedLoaderComponent } from './components/shared-loader/shared-loader.component';
import { SharedAnswerModalComponent } from './components/shared-answer-modal/shared-answer-modal.component';
import { SharedAnswerQuestionComponent } from './components/shared-answer-question/shared-answer-question.component';
import { SharedPaginationComponent } from './components/shared-pagination/shared-pagination.component';
import { SharedFilterInputComponent } from './components/shared-filter-input/shared-filter-input.component';
import { SharedModalComponent } from './components/shared-modal-component/shared-modal.component';
import { SharedVideoComponent } from './components/shared-video/shared-video.component';
import { SharedSortComponent } from './components/shared-sort/shared-sort.component';
import { SharedRatingItemComponent } from './components/shared-rating-item/shared-rating-item.component';
import { SharedTagItemComponent } from './components/shared-tag-item/shared-tag-item.component';
import { SharedTextZoneComponent } from './components/shared-text-zone/shared-text-zone.component';
import { SharedProjectDescriptionComponent } from './components/shared-project-description/shared-project-description.component';
import { SharedLatexManagerComponent } from './components/shared-latex-manager/shared-latex-manager.component';
import { SharedProjectSettingsComponent } from './components/shared-project-settings-component/shared-project-settings.component';
import { SharedClickableWorldmapComponent } from './components/shared-clickable-worldmap-component/shared-clickable-worldmap.component';
import { SharedSearchHistoryComponent } from './components/shared-search-history/shared-search-history.component';
import { SharedSearchProsComponent } from './components/shared-search-pros/shared-search-pros.component';
import { SharedSearchMailComponent } from './components/shared-search-mail/shared-search-mail.component';
import { SharedProjectEditComponent } from './components/shared-project-edit/shared-project-edit.component';
import { SharedProsListComponent } from './components/shared-pros-list/shared-pros-list.component';
import { SharedSearchResultsComponent } from './components/shared-search-results/shared-search-results.component';
import { SharedSmartSelectInputComponent } from './components/shared-smart-select/shared-smart-select.component';
import { SharedMarketReportExampleComponent } from './components/shared-market-report-example/shared-market-report-example.component';

// Pipes
import { DomSanitizerPipe } from '../../pipes/DomSanitizer';
import { MultilingPipe } from '../../pipes/multiling.pipe';

// Directives
import { InputListComponent } from '../../directives/input-list/input-list.component';
import { AutocompleteInputComponent } from '../../directives/autocomplete-input/autocomplete-input.component';
import { CountryFlagComponent } from '../../directives/country-flag/country-flag.component';
import { HeaderComponent } from '../../directives/header/header.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    RouterModule.forChild([]), // giving no routes but needed for all <a [routerLink]=''> uses
    TranslateModule.forChild(),
    FileUploadModule,
    Ng2FileDropModule,
    Angular2FontawesomeModule,
    Ng2PageScrollModule,
    Ng2AutoCompleteModule
  ],
  declarations: [
    // Directives
    // FormErrorDirective,
    CountryFlagComponent,
    InputListComponent,

    SharedNotFoundComponent,
    SharedUploadZonePhotoComponent,
    SharedUploadZoneVideoComponent,
    SharedLoaderComponent,
    SharedAnswerModalComponent,
    SharedAnswerQuestionComponent,
    SharedPaginationComponent,
    SharedFilterInputComponent,
    SharedTextZoneComponent,
    SharedModalComponent,
    SharedProjectDescriptionComponent,
    SharedLatexManagerComponent,
    SharedVideoComponent,
    SharedSortComponent,
    SharedProjectSettingsComponent,
    SharedClickableWorldmapComponent,
    AutocompleteInputComponent,
    SharedRatingItemComponent,
    SharedTagItemComponent,
    SharedSearchHistoryComponent,
    SharedSearchProsComponent,
    SharedSearchMailComponent,
    SharedProjectEditComponent,
    SharedProsListComponent,
    SharedSearchResultsComponent,
    SharedSmartSelectInputComponent,
    SharedMarketReportExampleComponent,
    DomSanitizerPipe,
    MultilingPipe,
    HeaderComponent
  ],
  exports: [
    // Modules
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    Ng2FileDropModule,
    Ng2PageScrollModule,

    // Directives
    CountryFlagComponent,
    InputListComponent,

    // Components
    SharedNotFoundComponent,
    SharedUploadZonePhotoComponent,
    SharedUploadZoneVideoComponent,
    SharedLoaderComponent,
    SharedPaginationComponent,
    SharedFilterInputComponent,
    SharedTextZoneComponent,
    SharedModalComponent,
    SharedProjectDescriptionComponent,
    SharedLatexManagerComponent,
    SharedSortComponent,
    SharedProjectSettingsComponent,
    SharedClickableWorldmapComponent,
    AutocompleteInputComponent,
    SharedAnswerModalComponent,
    SharedAnswerQuestionComponent,
    SharedRatingItemComponent,
    SharedTagItemComponent,
    SharedSearchHistoryComponent,
    SharedSearchProsComponent,
    SharedSearchMailComponent,
    SharedProjectEditComponent,
    SharedProsListComponent,
    SharedSearchResultsComponent,
    SharedSmartSelectInputComponent,
    HeaderComponent
  ]
})
export class SharedModule { }
