import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SharedProsListOldComponent } from './shared-pros-list-old.component';

import { SharedSortModule } from '../shared-sort/shared-sort.module';
import { SharedFilterInputModule } from '../shared-filter-input/shared-filter-input.module';
import { SharedSmartSelectModule } from '../shared-smart-select/shared-smart-select.module';
import { PaginationModule} from '../../../utility-components/pagination/pagination.module';
import { CountryFlagModule } from '../../../utility-components/country-flag/country-flag.module';
import { ModalModule } from "../../../utility-components/modals/modal/modal.module";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    SharedSortModule,
    SharedFilterInputModule,
    SharedSmartSelectModule,
    FormsModule,
    PaginationModule,
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
