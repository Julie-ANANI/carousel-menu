import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PiechartExecutiveComponent } from './piechart-executive.component';

import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    ChartsModule,
  ],
  declarations: [
    PiechartExecutiveComponent
  ],
  exports: [
    PiechartExecutiveComponent
  ]
})

export class PiechartExecutiveModule {}
