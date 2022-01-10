import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SharedSearchResultsComponent } from './shared-search-results.component';

import { SharedProsListModule } from '../shared-pros-list/shared-pros-list.module';
import { SharedProsListOldModule } from '../shared-pros-list-old/shared-pros-list-old.module';
import { AutoCompleteInputModule } from '../../../utility/auto-complete-input/auto-complete-input.module';
import { CountryFlagModule } from '@umius/umi-common-component/country-flag';
import { ModalModule } from "../../../utility/modals/modal/modal.module";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedProsListModule,
    TranslateModule.forChild(),
    SharedProsListOldModule,
    AutoCompleteInputModule,
    CountryFlagModule,
    ModalModule
  ],
  declarations: [
    SharedSearchResultsComponent
  ],
  exports: [
    SharedSearchResultsComponent
  ]
})

export class SharedSearchResultsModule { }
