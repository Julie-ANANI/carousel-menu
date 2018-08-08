import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { AutocompleteInputComponent } from './autocomplete-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    Ng2AutoCompleteModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule
  ],
  declarations: [
    AutocompleteInputComponent
  ],
  exports: [
    AutocompleteInputComponent
  ]
})

export class AutocompleteInputModule {}
