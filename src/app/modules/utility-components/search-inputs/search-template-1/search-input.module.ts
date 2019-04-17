import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SearchInputComponent} from './search-input.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [
    SearchInputComponent
  ],
  exports: [
    SearchInputComponent
  ]
})

export class SearchInputModule {}
