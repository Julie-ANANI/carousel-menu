import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import {MarketTestObjectivesComponent} from './market-test-objectives.component';
import {NgxPageScrollModule} from 'ngx-page-scroll';
import {MarketTestMethodologyModule} from '../market-test-methodology/market-test-methodology.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    NgxPageScrollModule,
    MarketTestMethodologyModule
  ],
  declarations: [
    MarketTestObjectivesComponent
  ],
  exports: [
    MarketTestObjectivesComponent
  ]
})

export class MarketTestObjectivesModule {}
