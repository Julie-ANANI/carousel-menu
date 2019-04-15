import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SharedSearchResultsComponent } from './shared-search-results.component';

import { SharedProsListModule } from '../shared-pros-list/shared-pros-list.module';
import { SharedProsListOldModule } from '../shared-pros-list-old/shared-pros-list-old.module';
import { AutocompleteInputModule } from '../../../utility-components/autocomplete-input/autocomplete-input.module';
import { CountryFlagModule } from '../../../utility-components/country-flag/country-flag.module';
import { ModalModule } from "../../../utility-components/modals/modal/modal.module";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedProsListModule,
    TranslateModule.forChild(),
    SharedProsListOldModule,
    AutocompleteInputModule,
    CountryFlagModule,
    ModalModule
  ],
  declarations: [
    SharedSearchResultsComponent
  ],
  exports: [
    SharedSearchResultsComponent
  ]
})

export class SharedSearchResultsModule { }
