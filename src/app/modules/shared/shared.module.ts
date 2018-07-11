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
import { SharedAnswersListComponent } from './components/shared-answers-list/shared-answers-list.component';
import { SharedNotFoundComponent } from './components/shared-not-found/shared-not-found.component';
import { SharedUploadZonePhotoComponent } from './components/shared-upload-zone-photo/shared-upload-zone-photo.component';
import { SharedUploadZoneVideoComponent } from './components/shared-upload-zone-video/shared-upload-zone-video.component';
import { SharedLoaderComponent } from './components/shared-loader/shared-loader.component';
import { SharedPaginationComponent } from './components/shared-pagination/shared-pagination.component';
import { SharedFilterInputComponent } from './components/shared-filter-input/shared-filter-input.component';
import { SharedFilterMultiComponent} from './components/shared-filter-multi/shared-filter-multi.component';
import { SharedVideoComponent } from './components/shared-video/shared-video.component';
import { SharedSortComponent } from './components/shared-sort/shared-sort.component';
import { SharedTagItemComponent } from './components/shared-tag-item/shared-tag-item.component';
import { SharedTextZoneComponent } from './components/shared-text-zone/shared-text-zone.component';
import { SharedProjectDescriptionComponent } from './components/shared-project-description/shared-project-description.component';
import { SharedLatexManagerComponent } from './components/shared-latex-manager/shared-latex-manager.component';
import { SharedProjectSettingsComponent } from './components/shared-project-settings-component/shared-project-settings.component';
import { SharedSearchHistoryComponent } from './components/shared-search-history/shared-search-history.component';
import { SharedSearchProsComponent } from './components/shared-search-pros/shared-search-pros.component';
import { SharedSearchMailComponent } from './components/shared-search-mail/shared-search-mail.component';
import { SharedProsListComponent } from './components/shared-pros-list/shared-pros-list.component';
import { SharedProsListOldComponent } from './components/shared-pros-list-old/shared-pros-list-old.component';
import { SharedSearchResultsComponent } from './components/shared-search-results/shared-search-results.component';
import { SharedSmartSelectInputComponent } from './components/shared-smart-select/shared-smart-select.component';
import { SharedMarketReportExampleComponent } from './components/shared-market-report-example/shared-market-report-example.component';
import { SharedTableComponent } from './components/shared-table/components/shared-table.component';
import { SharedEditEmail } from './components/shared-edit-email/shared-edit-email.component';
import { SharedEditEmailsStep } from './components/shared-edit-emails-step/shared-edit-emails-step.component';
import { SharedEditScenarioComponent } from './components/shared-edit-scenario/shared-edit-scenario.component';
import { SharedProjectEditCardsComponent } from './components/shared-project-edit-cards-component/shared-project-edit-cards.component';
import { SharedEmailBlacklistComponent } from './components/shared-email-blacklist/shared-email-blacklist.component';
import { GlobalModule } from "../global/global.module";

// Pipes
/*import { DomSanitizerPipe } from '../../pipes/DomSanitizer';
import { FilterPipe } from '../../pipes/TableFilterPipe';
import { LimitsPipe } from '../../pipes/TableLimitsPipe';
import { CharacterCountdown } from '../../pipes/CharacterCountdown';
import { MultilingModule } from '../../pipes/multiling/multiling.module';*/


import { MultilingModule } from '../../pipes/multiling/multiling.module';

// Directives
/*import { InputListComponent } from '../../directives/input-list/input-list.component';
import { AutocompleteInputComponent } from '../../directives/autocomplete-input/autocomplete-input.component';
import { SearchInputComponent } from '../../directives/search-input/search-input.component';*/

// Internal Modules
import { SharedWorldmapModule } from './components/shared-worldmap/shared-worldmap.module';
import { SidebarModule } from './components/shared-sidebar/sidebar.module';
// import { TableModule } from './components/shared-table/table.module';
import { CountryFlagModule } from '../../directives/country-flag/country-flag.module';

@NgModule({
  imports: [
    CommonModule,
    CountryFlagModule,
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
    SharedWorldmapModule,
    SidebarModule,
    SharedWorldmapModule,
    MultilingModule,
    GlobalModule
  ],
  declarations: [
    // Directives
    // FormErrorDirective,
    //InputListComponent,
    SharedAnswersListComponent,
    SharedNotFoundComponent,
    SharedUploadZonePhotoComponent,
    SharedUploadZoneVideoComponent,
    SharedLoaderComponent,
    SharedPaginationComponent,
    SharedFilterInputComponent,
    SharedFilterMultiComponent,
    SharedTextZoneComponent,
    SharedProjectDescriptionComponent,
    SharedLatexManagerComponent,
    SharedVideoComponent,
    SharedSortComponent,
    SharedProjectSettingsComponent,
    //AutocompleteInputComponent,
    //SearchInputComponent,
    SharedTagItemComponent,
    SharedSearchHistoryComponent,
    SharedSearchProsComponent,
    SharedSearchMailComponent,
    SharedProsListComponent,
    SharedProsListOldComponent,
    SharedSearchResultsComponent,
    SharedSmartSelectInputComponent,
    SharedMarketReportExampleComponent,
    SharedTableComponent,
    SharedEditEmail,
    SharedEditEmailsStep,
    SharedEditScenarioComponent,
    SharedProjectEditCardsComponent,
    //DomSanitizerPipe,
    //FilterPipe,
    //LimitsPipe,
    SharedEmailBlacklistComponent,
    //CharacterCountdown
  ],
  exports: [
    // Modules
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    Ng2FileDropModule,
    Ng2PageScrollModule,
    SidebarModule,
    CountryFlagModule,
    // TableModule,

    // Directives
    //InputListComponent,

    // Components
    SharedNotFoundComponent,
    SharedAnswersListComponent,
    SharedUploadZonePhotoComponent,
    SharedUploadZoneVideoComponent,
    SharedLoaderComponent,
    SharedPaginationComponent,
    SharedFilterInputComponent,
    SharedFilterMultiComponent,
    SharedTextZoneComponent,
    SharedProjectDescriptionComponent,
    SharedLatexManagerComponent,
    SharedSortComponent,
    SharedProjectSettingsComponent,
    //AutocompleteInputComponent,
    //SearchInputComponent,
    SharedTagItemComponent,
    SharedSearchHistoryComponent,
    SharedSearchProsComponent,
    SharedSearchMailComponent,
    SharedProsListComponent,
    SharedProsListOldComponent,
    SharedSearchResultsComponent,
    SharedSmartSelectInputComponent,
    SharedTableComponent,
    SharedEditEmail,
    SharedEditEmailsStep,
    SharedEditScenarioComponent,
    SharedProjectEditCardsComponent,
    SharedEmailBlacklistComponent,
    //FilterPipe,
    //LimitsPipe,
    //CharacterCountdown
  ]
})

export class SharedModule {}
