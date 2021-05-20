import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import {MarketTestMethodologyComponent} from './market-test-methodology.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild()
  ],
  declarations: [
    MarketTestMethodologyComponent
  ],
  exports: [
    MarketTestMethodologyComponent
  ]
})

export class MarketTestMethodologyModule {}
