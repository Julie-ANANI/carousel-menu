import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { TranslateModule} from '@ngx-translate/core';
import { LikertScaleChartComponent } from './likert-scale-chart.component';
import {GaugeModule} from "../../../../../utility/gauge-bar/gauge-chart.module";

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        GaugeModule
    ],
  declarations: [LikertScaleChartComponent],
  exports:[LikertScaleChartComponent]
})
export class LikertScaleChartModule { }
