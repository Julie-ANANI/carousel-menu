import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SharedSearchHistoryComponent} from './shared-search-history.component';

import { SharedFilterInputModule } from '../shared-filter-input/shared-filter-input.module';
import { PaginationTemplate1Module } from '../../../utility-components/paginations/pagination-template-1/pagination-template-1.module';
import { SharedSearchMultiModule } from '../shared-search-multi/shared-search-multi.module';
import { CountryFlagModule } from '../../../utility-components/country-flag/country-flag.module';
import { TableModule } from "../../../table/table.module";
import { SidebarModule } from "../../../sidebar/sidebar.module";
import { SidebarSearchHistoryModule } from "../../../sidebar/components/sidebar-search-history/sidebar-search-history.module";
import { AutoCompleteInputModule } from "../../../utility-components/auto-complete-input/auto-complete-input.module";
import { ModalModule } from "../../../utility-components/modals/modal/modal.module";
import {SharedTargetingWorldModule} from "../shared-targeting-world/shared-targeting-world.module";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    SharedFilterInputModule,
    TranslateModule.forChild(),
    PaginationTemplate1Module,
    SharedSearchMultiModule,
    CountryFlagModule,
    TableModule,
    SidebarModule,
    SidebarSearchHistoryModule,
    AutoCompleteInputModule,
    ModalModule,
    SharedTargetingWorldModule
  ],
  declarations: [
    SharedSearchHistoryComponent,
  ],
  exports: [
    SharedSearchHistoryComponent
  ]
})

export class SharedSearchHistoryModule { }
