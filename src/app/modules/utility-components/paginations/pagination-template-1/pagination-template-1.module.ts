import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationTemplate1Component } from './pagination-template-1.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [
    PaginationTemplate1Component
  ],
  exports: [
    PaginationTemplate1Component
  ]
})

export class PaginationTemplate1Module {}
