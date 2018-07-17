import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { RouterModule } from '@angular/router';
import { PipeModule } from '../../pipe/pipe.module';

import { AutocompleteInputComponent } from './autocomplete-input.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FormsModule,
    ReactiveFormsModule,
    Ng2AutoCompleteModule,
    RouterModule,
    PipeModule
  ],
  declarations: [
   AutocompleteInputComponent
  ],
  exports: [
   AutocompleteInputComponent
  ]
})

export class AutocompleteInputModule { }
