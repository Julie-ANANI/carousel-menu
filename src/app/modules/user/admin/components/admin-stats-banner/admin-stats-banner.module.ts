import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {AdminStatsBannerComponent} from './admin-stats-banner.component';
import {GaugeModule} from '../../../../utility/gauge-bar/gauge-chart.module';

@NgModule({
    imports: [
        CommonModule,
        GaugeModule
    ],
  exports: [
    AdminStatsBannerComponent
  ],
  declarations: [
    AdminStatsBannerComponent
  ]
})

export class AdminStatsBannerModule {}
