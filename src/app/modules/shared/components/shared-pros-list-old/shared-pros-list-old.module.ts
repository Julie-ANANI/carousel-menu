import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SharedProsListOldComponent } from './shared-pros-list-old.component';

import { SharedSortModule } from '../shared-sort/shared-sort.module';
import { SharedFilterInputModule } from '../shared-filter-input/shared-filter-input.module';
import { SharedSmartSelectModule } from '../shared-smart-select/shared-smart-select.module';
import { PaginationTemplate1Module} from '../../../utility/paginations/pagination-template-1/pagination-template-1.module';
import { CountryFlagModule } from '@umius/umi-common-component/country-flag';
import { ModalModule } from "../../../utility/modals/modal/modal.module";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    SharedSortModule,
    SharedFilterInputModule,
    SharedSmartSelectModule,
    FormsModule,
    PaginationTemplate1Module,
    CountryFlagModule,
    ModalModule
  ],
  declarations: [
    SharedProsListOldComponent
  ],
  exports: [
    SharedProsListOldComponent
  ]
})

export class SharedProsListOldModule { }
