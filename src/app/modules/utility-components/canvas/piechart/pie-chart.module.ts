import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { PiechartComponent } from './piechart.component';

import { ChartsModule } from 'ng2-charts';
import { PipeModule } from '../../../../pipe/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ChartsModule,
    PipeModule
  ],
  declarations: [
    PiechartComponent
  ],
  exports: [
    PiechartComponent
  ]
})

export class PieChartModule {}
