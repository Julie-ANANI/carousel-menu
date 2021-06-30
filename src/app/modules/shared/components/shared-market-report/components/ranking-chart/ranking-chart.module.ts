import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RankingChartComponent } from './ranking-chart.component';
import {PipeModule} from '../../../../../../pipe/pipe.module';

@NgModule({
    declarations: [RankingChartComponent],
    exports: [
        RankingChartComponent
    ],
  imports: [
    CommonModule,
    PipeModule
  ]
})
export class RankingChartModule { }
