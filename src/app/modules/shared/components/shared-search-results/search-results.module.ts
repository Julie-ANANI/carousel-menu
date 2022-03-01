import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SharedSearchResultsComponent } from './shared-search-results.component';

import { SharedProsListModule } from '../shared-pros-list/shared-pros-list.module';
import { SharedProsListOldModule } from '../shared-pros-list-old/shared-pros-list-old.module';
import { AutoCompleteInputModule } from '../../../utility/auto-complete-input/auto-complete-input.module';
import {CountryFlagModule, ModalModule} from '@umius/umi-common-component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedProsListModule,
    TranslateModule.forChild(),
    SharedProsListOldModule,
    AutoCompleteInputModule,
    CountryFlagModule,
    ModalModule,
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
