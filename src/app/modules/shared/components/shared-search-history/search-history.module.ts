// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedPaginationModule } from '../shared-pagination/shared-pagination.module';
import {SharedFilterInputModule} from '../shared-filter-input/filter-input.module';
import {InputModule} from '../../../input/input.module';

// Components
import { SharedSearchHistoryComponent} from './shared-search-history.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    SharedFilterInputModule,
    SharedPaginationModule,
    TranslateModule.forChild(),
    InputModule
  ],
  declarations: [
    SharedSearchHistoryComponent
  ],
  exports: [
    SharedSearchHistoryComponent
  ]
})

export class SharedSearchHistoryModule { }
