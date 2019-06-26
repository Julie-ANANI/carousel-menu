import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { TableComponent } from './components/table.component';

import { SharedSearchMultiModule } from '../shared/components/shared-search-multi/shared-search-multi.module';
import { SharedSortModule } from '../shared/components/shared-sort/shared-sort.module';
import { ProgressBarModule } from '../utility-components/progress-bar/progress-bar.module';
import { SharedLoaderModule } from '../shared/components/shared-loader/shared-loader.module';
import { CountryFlagModule } from '../utility-components/country-flag/country-flag.module';
import { PipeModule } from '../../pipe/pipe.module';
import { MessageSpaceModule } from '../utility-components/messages/message-template-1/message-space.module';
import { PaginationTemplate2Module } from '../utility-components/paginations/pagination-template-2/pagination-template-2.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedSearchMultiModule,
    SharedSortModule,
    FormsModule,
    TranslateModule.forChild(),
    PipeModule,
    ProgressBarModule,
    SharedLoaderModule,
    CountryFlagModule,
    MessageSpaceModule,
    PaginationTemplate2Module
  ],
  declarations: [
    TableComponent
  ],
  exports: [
    TableComponent,
  ]
})

export class TableModule { }
