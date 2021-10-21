import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import {AutoCompleteCompanyComponent} from './auto-complete-company.component';
import {NguiAutoCompleteModule} from '../auto-complete/auto-complete.module';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    NguiAutoCompleteModule,
    FormsModule
  ],
  declarations: [
    AutoCompleteCompanyComponent
  ],
  exports: [
    AutoCompleteCompanyComponent
  ]
})

export class AutoCompleteCompanyModule {}
