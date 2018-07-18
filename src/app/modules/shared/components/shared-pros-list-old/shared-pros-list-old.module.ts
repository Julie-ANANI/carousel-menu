// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {SharedProsListOldComponent} from './shared-pros-list-old.component';
import {SharedSortModule} from '../shared-sort/shared-sort.module';
import {SharedFilterInputModule} from '../shared-filter-input/shared-filter-input.module';
import {SharedSmartSelectModule} from '../shared-smart-select/shared-smart-select.module';
import {SharedPaginationModule} from '../shared-pagination/shared-pagination.module';
import {InputModule} from '../../../input/input.module';

// Components

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    SharedSortModule,
    SharedFilterInputModule,
    SharedSmartSelectModule,
    InputModule,
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
