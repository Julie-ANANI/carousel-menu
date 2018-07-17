// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { SharedFilterMultiModule } from '../shared-filter-multi/filter-multi.module';
import { SharedSortModule } from '../shared-sort/sort.module';
import { CountryFlagModule } from '../../../../directives/country-flag/country-flag.module';
import { SharedPaginationModule } from '../shared-pagination/pagination.module';

// Components
import { SharedTableComponent } from './components/shared-table.component';
import { EllipsisModule } from "../../../../pipes/ellipsis/ellipsis.module";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedFilterMultiModule,
    CountryFlagModule,
    SharedSortModule,
    SharedPaginationModule,
    FormsModule,
    TranslateModule.forChild(),
    EllipsisModule
  ],
  declarations: [
    SharedTableComponent
  ],
  exports: [
    SharedTableComponent,
  ]
})

export class SharedTableModule { }
