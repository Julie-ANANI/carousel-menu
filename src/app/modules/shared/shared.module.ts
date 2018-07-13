// Modules externes
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedTableModule } from './components/shared-table/table.module';
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
import { SharedVideoComponent } from './components/shared-video/shared-video.component';
import { SharedProjectDescriptionComponent } from './components/shared-project-description/shared-project-description.component';
import { SharedLatexManagerComponent } from './components/shared-latex-manager/shared-latex-manager.component';
import { SharedProjectSettingsComponent } from './components/shared-project-settings-component/shared-project-settings.component';
import { SharedSearchMailComponent } from './components/shared-search-mail/shared-search-mail.component';
import { SharedSmartSelectInputComponent } from './components/shared-smart-select/shared-smart-select.component';
import { SharedMarketReportExampleComponent } from './components/shared-market-report-example/shared-market-report-example.component';
import { SharedProjectEditCardsComponent } from './components/shared-project-edit-cards-component/shared-project-edit-cards.component';

// Pipes
import { DomSanitizerPipe } from '../../pipes/DomSanitizer';
import { FilterPipe } from '../../pipes/TableFilterPipe';
import { LimitsPipe } from '../../pipes/TableLimitsPipe';
import { CharacterCountdown } from '../../pipes/CharacterCountdown';
import { MultilingModule } from '../../pipes/multiling/multiling.module';

// Directives
import { SearchInputComponent } from '../../directives/search-input/search-input.component';

// Internal Modules
import { SharedWorldmapModule } from './components/shared-worldmap/shared-worldmap.module';
import { SidebarModule } from './components/shared-sidebar/sidebar.module';
import { InputListModule } from '../../directives/input-list/input-list.module';
import { CountryFlagModule } from '../../directives/country-flag/country-flag.module';
import { AutocompleteInputModule } from '../../directives/autocomplete-input/autocomplete-input.module';
import { SharedTagItemModule } from './components/shared-tag-item/shared-tag-item.module';

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
    InputListModule,
    SidebarModule,
    SharedWorldmapModule,
    MultilingModule,
    AutocompleteInputModule,
    SharedTagItemModule
  ],
  declarations: [
    // Directives
    // FormErrorDirective,
    SharedNotFoundComponent,
    SharedUploadZonePhotoComponent,
    SharedUploadZoneVideoComponent,
    SharedLoaderComponent,
    SharedProjectDescriptionComponent,
    SharedLatexManagerComponent,
    SharedVideoComponent,
    SharedProjectSettingsComponent,
    SearchInputComponent,
    SharedSearchMailComponent,
    SharedSmartSelectInputComponent,
    SharedMarketReportExampleComponent,
    SharedProjectEditCardsComponent,
    DomSanitizerPipe,
    FilterPipe,
    LimitsPipe,
    CharacterCountdown
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
    SharedTableModule,
    InputListModule,
    SharedTagItemModule,
    SharedTableModule,

    // Components
    SharedNotFoundComponent,
    SharedUploadZonePhotoComponent,
    SharedUploadZoneVideoComponent,
    SharedLoaderComponent,
    SharedProjectDescriptionComponent,
    SharedLatexManagerComponent,
    SharedProjectSettingsComponent,
    SearchInputComponent,
    SharedSearchMailComponent,
    SharedSmartSelectInputComponent,
    SharedProjectEditCardsComponent,
    FilterPipe,
    LimitsPipe,
    CharacterCountdown
  ]
})

export class SharedModule {}
