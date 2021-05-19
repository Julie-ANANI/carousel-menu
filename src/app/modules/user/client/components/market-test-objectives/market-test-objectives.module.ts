import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import {MarketTestObjectivesComponent} from './market-test-objectives.component';
import {NgxPageScrollModule} from 'ngx-page-scroll';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    NgxPageScrollModule
  ],
  declarations: [
    MarketTestObjectivesComponent
  ],
  exports: [
    MarketTestObjectivesComponent
  ]
})

export class MarketTestObjectivesModule {}
