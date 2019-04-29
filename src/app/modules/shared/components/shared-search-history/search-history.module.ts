import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SharedSearchHistoryComponent} from './shared-search-history.component';

import { SharedFilterInputModule } from '../shared-filter-input/shared-filter-input.module';
import { PaginationTemplate1Module } from '../../../utility-components/paginations/pagination-template-1/pagination-template-1.module';
import { SharedFilterMultiModule } from '../shared-filter-multi/shared-filter-multi.module';
import { CountryFlagModule } from '../../../utility-components/country-flag/country-flag.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    SharedFilterInputModule,
    TranslateModule.forChild(),
    PaginationTemplate1Module,
    SharedFilterMultiModule,
    CountryFlagModule
  ],
  declarations: [
    SharedSearchHistoryComponent,
  ],
  exports: [
    SharedSearchHistoryComponent
  ]
})

export class SharedSearchHistoryModule { }
