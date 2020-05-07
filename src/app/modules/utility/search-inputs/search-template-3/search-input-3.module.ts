import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SearchInput3Component } from './search-input-3.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [
    SearchInput3Component
  ],
  exports: [
    SearchInput3Component
  ]
})

export class SearchInput3Module {}
