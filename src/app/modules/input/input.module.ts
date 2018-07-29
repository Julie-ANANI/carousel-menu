import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { PipeModule } from '../../pipe/pipe.module';
import { AutocompleteInputComponent } from './component/autocomplete-input/autocomplete-input.component';
import { InputListComponent } from './component/input-list/input-list.component';
import { SearchInputComponent } from './component/search-input/search-input.component';
import { CountryFlagComponent } from './component/country-flag/country-flag.component';
import { ProgressBarComponent } from './component/progress-bar/progress-bar.component';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2AutoCompleteModule,
    RouterModule,
    PipeModule
  ],
  declarations: [
  AutocompleteInputComponent,
  InputListComponent,
  SearchInputComponent,
  CountryFlagComponent,
  ProgressBarComponent
  ],
  exports: [
    AutocompleteInputComponent,
    InputListComponent,
    SearchInputComponent,
    CountryFlagComponent,
    ProgressBarComponent
  ]
})

export class InputModule {}
