import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import {MarketTestObjectivesSecondaryComponent} from './market-test-objectives-secondary.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FormsModule
  ],
  declarations: [
    MarketTestObjectivesSecondaryComponent
  ],
  exports: [
    MarketTestObjectivesSecondaryComponent
  ]
})

export class MarketTestObjectivesSecondaryModule {}
