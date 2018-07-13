// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {SharedProsListModule} from '../shared-pros-list/pros-list.module';
import {AutocompleteInputModule} from '../../../../directives/autocomplete-input/autocomplete-input.module';
import { CountryFlagModule } from '../../../../directives/country-flag/country-flag.module';

// Components
import {SharedSearchResultsComponent} from './shared-search-results.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AutocompleteInputModule,
    SharedProsListModule,
    CountryFlagModule,
    TranslateModule.forChild()
  ],
  declarations: [
    SharedSearchResultsComponent
  ],
  exports: [
    SharedSearchResultsComponent
  ]
})

export class SharedSearchResultsModule { }
