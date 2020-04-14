import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AutoSuggestionComponent } from './auto-suggestion.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [
    AutoSuggestionComponent
  ],
  exports: [
    AutoSuggestionComponent
  ]
})

export class AutoSuggestionModule {}
