import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PaginationTemplate2Component } from './pagination-template-2.component';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [
    PaginationTemplate2Component
  ],
  exports: [
    PaginationTemplate2Component
  ]
})

export class PaginationTemplate2Module {}
