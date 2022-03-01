import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SharedSearchHistoryComponent} from './shared-search-history.component';

import { SharedFilterInputModule } from '../shared-filter-input/shared-filter-input.module';
import { SidebarSearchHistoryModule } from '../../../sidebars/components/sidebar-search-history/sidebar-search-history.module';
import { AutoCompleteInputModule } from '../../../utility/auto-complete-input/auto-complete-input.module';
import {SharedTargetingWorldModule} from '../shared-targeting-world/shared-targeting-world.module';
import {ModalModule, SidebarFullModule, TableModule} from '@umius/umi-common-component';
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    SharedFilterInputModule,
    TranslateModule.forChild(),
    SidebarSearchHistoryModule,
    AutoCompleteInputModule,
    SharedTargetingWorldModule,
    TableModule,
    SidebarFullModule,
    ModalModule
  ],
  declarations: [
    SharedSearchHistoryComponent,
  ],
  exports: [
    SharedSearchHistoryComponent
  ]
})

export class SharedSearchHistoryModule { }
