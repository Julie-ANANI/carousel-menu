import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { TranslateModule} from '@ngx-translate/core';
import { LikertScaleChartComponent } from './likert-scale-chart.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule
  ],
  declarations: [LikertScaleChartComponent],
  exports:[LikertScaleChartComponent]
})
export class LikertScaleChartModule { }
