import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SharedProsListOldComponent } from './shared-pros-list-old.component';

import { SharedFilterInputModule } from '../shared-filter-input/shared-filter-input.module';
import { SharedSmartSelectModule } from '../shared-smart-select/shared-smart-select.module';
import {CountryFlagModule, ModalModule, PaginationModule, SortModule} from '@umius/umi-common-component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    SharedFilterInputModule,
    SharedSmartSelectModule,
    FormsModule,
    SortModule,
    CountryFlagModule,
    PaginationModule,
    ModalModule,
  ],
  declarations: [
    SharedProsListOldComponent
  ],
  exports: [
    SharedProsListOldComponent
  ]
})

export class SharedProsListOldModule { }
