import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { PiechartComponent } from './piechart.component';

import { ChartsModule } from 'ng2-charts';
import { PipeModule } from '../../../../pipe/pipe.module';
import {SharedColorPickerModule} from '../../../shared/components/shared-color-picker/shared-color-picker.module';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        ChartsModule,
        PipeModule,
        SharedColorPickerModule
    ],
  declarations: [
    PiechartComponent
  ],
  exports: [
    PiechartComponent
  ]
})

export class PieChartModule {}
