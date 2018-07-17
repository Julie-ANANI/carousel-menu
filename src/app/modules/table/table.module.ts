// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { SharedFilterMultiModule } from '../shared/components/shared-filter-multi/filter-multi.module';
import { SharedSortModule } from '../shared/components/shared-sort/shared-sort.module';
import { SharedPaginationModule } from '../shared/components/shared-pagination/shared-pagination.module';
import {InputModule} from '../input/input.module';

// Components
import { TableComponent } from './components/table.component';

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
    TableComponent
  ],
  exports: [
    TableComponent,
  ]
})

export class SharedTableModule { }
