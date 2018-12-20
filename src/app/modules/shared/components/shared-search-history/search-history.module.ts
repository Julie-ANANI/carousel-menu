import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedFilterInputModule } from '../shared-filter-input/shared-filter-input.module';
import { SharedSearchHistoryComponent} from './shared-search-history.component';
import { PaginationModule } from '../../../utility-components/pagination/pagination.module';
import { SharedFilterMultiModule } from '../shared-filter-multi/shared-filter-multi.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    SharedFilterInputModule,
    TranslateModule.forChild(),
    PaginationModule,
    SharedFilterMultiModule
  ],
  declarations: [
    SharedSearchHistoryComponent,
  ],
  exports: [
    SharedSearchHistoryComponent
  ]
})

export class SharedSearchHistoryModule { }
