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
import { SharedVideoComponent } from './components/shared-video/shared-video.component';
import { SharedProjectDescriptionComponent } from './components/shared-project-description/shared-project-description.component';
import { SharedLatexManagerComponent } from './components/shared-latex-manager/shared-latex-manager.component';
import { SharedProjectSettingsComponent } from './components/shared-project-settings-component/shared-project-settings.component';
import { SharedSearchMailComponent } from './components/shared-search-mail/shared-search-mail.component';
import { SharedMarketReportExampleComponent } from './components/shared-market-report-example/shared-market-report-example.component';
import { SharedProjectEditCardsComponent } from './components/shared-project-edit-cards-component/shared-project-edit-cards.component';
import { GlobalModule } from '../global/global.module';


// Internal Modules
import { SharedWorldmapModule } from './components/shared-worldmap/shared-worldmap.module';
import { SidebarModule } from './components/shared-sidebar/sidebar.module';
import { InputListModule } from '../../directives/input-list/input-list.module';
import { CountryFlagModule } from '../../directives/country-flag/country-flag.module';
import { AutocompleteInputModule } from '../../directives/autocomplete-input/autocomplete-input.module';
import { SharedTagItemModule } from './components/shared-tag-item/shared-tag-item.module';
import { SharedTextZoneModule } from './components/shared-text-zone/shared-text-zone.module';
import { SharedLoaderModule } from './components/shared-loader/shared-loader.module';

@NgModule({
  imports: [
    CommonModule,
    CountryFlagModule,
    SharedTextZoneModule,
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
    AutocompleteInputModule,
    GlobalModule,
    SharedLoaderModule
  ],
  declarations: [
    // Directives
    // FormErrorDirective,
    SharedNotFoundComponent,
    SharedUploadZonePhotoComponent,
    SharedUploadZoneVideoComponent,
    SharedProjectDescriptionComponent,
    SharedLatexManagerComponent,
    SharedVideoComponent,
    SharedProjectSettingsComponent,
    SharedSearchMailComponent,
    SharedMarketReportExampleComponent,
    SharedProjectEditCardsComponent
  ],
  exports: [
    // Modules
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    Ng2FileDropModule,
    Ng2PageScrollModule,
    CountryFlagModule,
    SharedTableModule,
    InputListModule,
    SharedTagItemModule,
    SharedTableModule,

    // Components
    SharedNotFoundComponent,
    SharedUploadZonePhotoComponent,
    SharedUploadZoneVideoComponent,
    SharedProjectDescriptionComponent,
    SharedLatexManagerComponent,
    SharedProjectSettingsComponent,
    SharedSearchMailComponent,
    SharedProjectEditCardsComponent
  ]
})

export class SharedModule {}
