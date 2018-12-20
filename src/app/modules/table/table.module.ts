import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { TableComponent } from './components/table.component';

import { SharedFilterMultiModule } from '../shared/components/shared-filter-multi/shared-filter-multi.module';
import { SharedSortModule } from '../shared/components/shared-sort/shared-sort.module';
import { PaginationModule } from '../utility-components/pagination/pagination.module';
import { ProgressBarModule } from '../input/component/progress-bar/progress-bar.module';
import { SharedLoaderModule } from '../shared/components/shared-loader/shared-loader.module';
import { CountryFlagModule } from '../utility-components/country-flag/country-flag.module';
import { PipeModule } from '../../pipe/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedFilterMultiModule,
    SharedSortModule,
    FormsModule,
    TranslateModule.forChild(),
    PaginationModule,
    PipeModule,
    ProgressBarModule,
    SharedLoaderModule,
    CountryFlagModule,
  ],
  declarations: [
    TableComponent
  ],
  exports: [
    TableComponent,
  ]
})

export class TableModule { }
