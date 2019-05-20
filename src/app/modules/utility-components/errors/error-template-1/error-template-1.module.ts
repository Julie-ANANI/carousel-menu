import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ErrorTemplate1Component } from './error-template-1.component';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    ErrorTemplate1Component
  ],
  exports: [
    ErrorTemplate1Component
  ]
})

export class ErrorTemplate1Module {}
