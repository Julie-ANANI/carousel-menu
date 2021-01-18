import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {GaugeChartComponent} from './gauge-chart.component';
import {GaugeChartModule} from 'angular-gauge-chart';

@NgModule({
  imports: [
    CommonModule,
    GaugeChartModule,
    TranslateModule.forChild()
  ],
  declarations: [
    GaugeChartComponent
  ],
  exports: [
    GaugeChartComponent
  ]
})

export class GaugeModule {
}
