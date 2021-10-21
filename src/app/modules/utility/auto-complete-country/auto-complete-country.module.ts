import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import {AutoCompleteCountryComponent} from './auto-complete-country.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FormsModule
  ],
  declarations: [
    AutoCompleteCountryComponent
  ],
  exports: [
    AutoCompleteCountryComponent
  ]
})

export class AutoCompleteCountryModule {}
