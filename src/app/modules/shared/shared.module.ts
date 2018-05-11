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
import { SharedPaginationComponent } from './components/shared-pagination/shared-pagination.component';
import { SharedFilterInputComponent } from './components/shared-filter-input/shared-filter-input.component';
import { SharedModalComponent } from './components/shared-modal-component/shared-modal.component';
import { SharedVideoComponent } from './components/shared-video/shared-video.component';
import { SharedSortComponent } from './components/shared-sort/shared-sort.component';
import { SharedTagItemComponent } from './components/shared-tag-item/shared-tag-item.component';
import { SharedTextZoneComponent } from './components/shared-text-zone/shared-text-zone.component';
import { SharedProjectDescriptionComponent } from './components/shared-project-description/shared-project-description.component';
import { SharedLatexManagerComponent } from './components/shared-latex-manager/shared-latex-manager.component';
import { SharedProjectSettingsComponent } from './components/shared-project-settings-component/shared-project-settings.component';
import { SharedClickableWorldmapComponent } from './components/shared-clickable-worldmap-component/shared-clickable-worldmap.component';
import { SharedSearchHistoryComponent } from './components/shared-search-history/shared-search-history.component';
import { SharedSearchProsComponent } from './components/shared-search-pros/shared-search-pros.component';
import { SharedSearchMailComponent } from './components/shared-search-mail/shared-search-mail.component';
import { SharedProsListComponent } from './components/shared-pros-list/shared-pros-list.component';
import { SharedSearchResultsComponent } from './components/shared-search-results/shared-search-results.component';
import { SharedSmartSelectInputComponent } from './components/shared-smart-select/shared-smart-select.component';
import { SharedMarketReportExampleComponent } from './components/shared-market-report-example/shared-market-report-example.component';
import { SharedEditEmail } from './components/shared-edit-email/shared-edit-email.component';
import { SharedEditEmailsStep } from './components/shared-edit-emails-step/shared-edit-emails-step.component';
import { SharedEditScenarioComponent } from './components/shared-edit-scenario/shared-edit-scenario.component';
import { SharedProjectEditCardsComponent } from './components/shared-project-edit-cards-component/shared-project-edit-cards.component';
import { SharedEmailBlacklistComponent } from './components/shared-email-blacklist/shared-email-blacklist.component';

// Pipes
import { DomSanitizerPipe } from '../../pipes/DomSanitizer';
import { FilterPipe } from '../../pipes/TableFilterPipe';
import { LimitsPipe } from '../../pipes/TableLimitsPipe';

// Directives
import { InputListComponent } from '../../directives/input-list/input-list.component';
import { AutocompleteInputComponent } from '../../directives/autocomplete-input/autocomplete-input.component';
import { SearchInputComponent } from '../../directives/search-input/search-input.component';
import { CountryFlagComponent } from '../../directives/country-flag/country-flag.component';
import { SidebarModule } from './components/shared-sidebar/sidebar.module';

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
    Ng2AutoCompleteModule,
    SidebarModule
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
    SearchInputComponent,
    SharedTagItemComponent,
    SharedSearchHistoryComponent,
    SharedSearchProsComponent,
    SharedSearchMailComponent,
    SharedProsListComponent,
    SharedSearchResultsComponent,
    SharedSmartSelectInputComponent,
    SharedMarketReportExampleComponent,
    SharedEditEmail,
    SharedEditEmailsStep,
    SharedEditScenarioComponent,
    SharedProjectEditCardsComponent,
    DomSanitizerPipe,
    FilterPipe,
    LimitsPipe,
    SharedEmailBlacklistComponent
  ],
  exports: [
    // Modules
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    Ng2FileDropModule,
    Ng2PageScrollModule,
    SidebarModule,

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
    SearchInputComponent,
    SharedTagItemComponent,
    SharedSearchHistoryComponent,
    SharedSearchProsComponent,
    SharedSearchMailComponent,
    SharedProsListComponent,
    SharedSearchResultsComponent,
    SharedSmartSelectInputComponent,
    SharedEditEmail,
    SharedEditEmailsStep,
    SharedEditScenarioComponent,
    SharedProjectEditCardsComponent,
    SharedEmailBlacklistComponent,
    FilterPipe,
    LimitsPipe
  ]
})

export class SharedModule {}
