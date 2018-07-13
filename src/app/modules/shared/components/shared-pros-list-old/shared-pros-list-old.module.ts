// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {SharedProsListOldComponent} from './shared-pros-list-old.component';
import {SharedSortModule} from '../shared-sort/sort.module';
import {SharedFilterInputModule} from '../shared-filter-input/filter-input.module';
import {SharedSmartSelectModule} from '../shared-smart-select/shared-smart-select.module';
import {CountryFlagModule} from '../../../../directives/country-flag/country-flag.module';
import {SharedPaginationModule} from '../shared-pagination/pagination.module';

// Components

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    SharedSortModule,
    SharedFilterInputModule,
    SharedSmartSelectModule,
    CountryFlagModule,
    SharedPaginationModule,
    FormsModule

  ],
  declarations: [
    SharedProsListOldComponent
  ],
  exports: [
    SharedProsListOldComponent
  ]
})

export class SharedProsListOldModule { }
