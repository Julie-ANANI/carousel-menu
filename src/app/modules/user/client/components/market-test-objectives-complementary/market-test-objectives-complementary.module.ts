import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import {MarketTestObjectivesComplementaryComponent} from './market-test-objectives-complementary.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FormsModule
  ],
  declarations: [
    MarketTestObjectivesComplementaryComponent
  ],
  exports: [
    MarketTestObjectivesComplementaryComponent
  ]
})

export class MarketTestObjectivesComplementaryModule {}
