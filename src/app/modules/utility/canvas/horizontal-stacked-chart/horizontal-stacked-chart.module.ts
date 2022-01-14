import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { TranslateModule} from '@ngx-translate/core';

import { HorizontalStackedChartComponent} from './horizontal-stacked-chart.component';
import { PipeModule} from '../../../../pipe/pipe.module';
import {ChartsModule} from 'ng2-charts';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
  CommonModule,
  TranslateModule,
  ChartsModule,
  PipeModule,
  FormsModule
  ],
  declarations: [
    HorizontalStackedChartComponent
  ],
  exports:[
    HorizontalStackedChartComponent
  ]
})
export class HorizontalStackedChartModule { }
