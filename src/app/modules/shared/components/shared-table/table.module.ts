// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { SharedFilterMultiModule } from '../shared-filter-multi/filter-multi.module';
import { SharedSortModule } from '../shared-sort/shared-sort.module';
import { SharedPaginationModule } from '../shared-pagination/shared-pagination.module';
import {InputModule} from '../../../input/input.module';

// Components
import { SharedTableComponent } from './components/shared-table.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedFilterMultiModule,
    SharedSortModule,
    SharedPaginationModule,
    FormsModule,
    TranslateModule.forChild(),
    InputModule
  ],
  declarations: [
    SharedTableComponent
  ],
  exports: [
    SharedTableComponent,
  ]
})

export class SharedTableModule { }
