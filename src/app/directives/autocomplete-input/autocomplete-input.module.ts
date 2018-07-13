import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutocompleteInputComponent } from './autocomplete-input.component';
import { MultilingModule } from '../../pipes/multiling/multiling.module';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FormsModule,
    ReactiveFormsModule,
    MultilingModule,
    Ng2AutoCompleteModule,
    RouterModule
  ],
  declarations: [
   AutocompleteInputComponent
  ],
  exports: [
   AutocompleteInputComponent
  ]
})

export class AutocompleteInputModule { }
