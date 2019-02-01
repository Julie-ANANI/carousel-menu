import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { CountryFlagComponent } from './country-flag.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    CountryFlagComponent
  ],
  exports: [
    CountryFlagComponent
  ]
})

export class CountryFlagModule {}
