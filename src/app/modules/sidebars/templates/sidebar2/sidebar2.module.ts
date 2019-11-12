import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { Sidebar2Component } from './sidebar2.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    Sidebar2Component,
  ],
  exports: [
    Sidebar2Component,
  ]
})

export class Sidebar2Module {}
