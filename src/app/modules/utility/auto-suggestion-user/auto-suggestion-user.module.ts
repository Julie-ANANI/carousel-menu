import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AutoSuggestionUserComponent } from './auto-suggestion-user.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [
    AutoSuggestionUserComponent
  ],
  exports: [
    AutoSuggestionUserComponent
  ]
})

export class AutoSuggestionUserModule {}
