import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SharedSearchProsComponent } from './shared-search-pros.component';

import { SidebarModule } from '../../../sidebar/sidebar.module';
import { SidebarSearchModule } from '../../../sidebar/components/sidebar-search/sidebar-search.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SidebarModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    SidebarSearchModule
  ],
  declarations: [
    SharedSearchProsComponent
  ],
  exports: [
    SharedSearchProsComponent
  ]
})

export class SharedSearchProsModule { }
