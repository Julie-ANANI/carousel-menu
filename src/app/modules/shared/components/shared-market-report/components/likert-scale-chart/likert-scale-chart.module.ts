import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { TranslateModule} from '@ngx-translate/core';
import { LikertScaleChartComponent } from './likert-scale-chart.component';
import {ProgressBarModule} from '../../../../../utility/progress-bar/progress-bar.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ProgressBarModule,
  ],
  declarations: [LikertScaleChartComponent],
  exports:[LikertScaleChartComponent]
})
export class LikertScaleChartModule { }
