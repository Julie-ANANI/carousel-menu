// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { SharedFilterMultiModule } from '../shared/components/shared-filter-multi/shared-filter-multi.module';
import { SharedSortModule } from '../shared/components/shared-sort/shared-sort.module';
import { InputModule } from '../input/input.module';
import { PaginationModule } from '../input/component/pagination/pagination.module';
import { ProgressBarModule } from '../input/component/progress-bar/progress-bar.module';

// Components
import { PipeModule } from '../../pipe/pipe.module';
import { TableComponent } from './components/table.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedFilterMultiModule,
    SharedSortModule,
    FormsModule,
    TranslateModule.forChild(),
    InputModule,
    PaginationModule,
    TranslateModule.forChild(),
    PipeModule,
    ProgressBarModule
  ],
  declarations: [
    TableComponent
  ],
  exports: [
    TableComponent,
  ]
})

export class TableModule { }
