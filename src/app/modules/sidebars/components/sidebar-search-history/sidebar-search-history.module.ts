import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SidebarSearchHistoryComponent } from './sidebar-search-history.component';
import {TableModule} from '@umius/umi-common-component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    TableModule
  ],
  declarations: [
   SidebarSearchHistoryComponent
  ],
  exports: [
    SidebarSearchHistoryComponent
  ]
})

export class SidebarSearchHistoryModule {}
