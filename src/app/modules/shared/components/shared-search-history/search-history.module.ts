// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedPaginationModule } from '../shared-pagination/pagination.module';
import {SharedFilterInputModule} from '../shared-filter-input/filter-input.module';
import {CountryFlagModule} from '../../../../directives/country-flag/country-flag.module';

// Components
import { SharedSearchHistoryComponent} from './shared-search-history.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CountryFlagModule,
    RouterModule,
    SharedFilterInputModule,
    SharedPaginationModule,
    TranslateModule.forChild()
  ],
  declarations: [
    SharedSearchHistoryComponent
  ],
  exports: [
    SharedSearchHistoryComponent
  ]
})

export class SharedSearchHistoryModule { }
