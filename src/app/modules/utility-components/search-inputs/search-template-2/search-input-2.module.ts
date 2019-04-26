import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SearchInput2Component } from './search-input-2.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [
    SearchInput2Component
  ],
  exports: [
    SearchInput2Component
  ]
})

export class SearchInput2Module {}
