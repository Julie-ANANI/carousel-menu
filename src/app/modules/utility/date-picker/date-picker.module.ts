import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import {DatePickerComponent} from './date-picker.component';
import {FormsModule} from '@angular/forms';
import {AngularMyDatePickerModule} from 'angular-mydatepicker';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FormsModule,
    AngularMyDatePickerModule,
  ],
  declarations: [
    DatePickerComponent
  ],
  exports: [
    DatePickerComponent
  ]
})

export class DatePickerModule {}
