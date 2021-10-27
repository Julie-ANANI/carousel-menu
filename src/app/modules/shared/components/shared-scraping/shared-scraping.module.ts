import { NgModule } from '@angular/core';

import { SharedScrapingComponent } from './shared-scraping.component';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {SharedFilterInputModule} from '../shared-filter-input/shared-filter-input.module';
import {TranslateModule} from '@ngx-translate/core';
import {PaginationTemplate1Module} from '../../../utility/paginations/pagination-template-1/pagination-template-1.module';
import {SidebarModule} from '../../../sidebars/templates/sidebar/sidebar.module';
import {AutoCompleteInputModule} from '../../../utility/auto-complete-input/auto-complete-input.module';
import {ModalModule} from '../../../utility/modals/modal/modal.module';
import {SidebarScrapingModule} from '../../../sidebars/components/sidebar-scraping/sidebar-scraping.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    SharedFilterInputModule,
    TranslateModule.forChild(),
    PaginationTemplate1Module,
    SidebarModule,
    AutoCompleteInputModule,
    ModalModule,
    SidebarScrapingModule
  ],
  declarations: [
    SharedScrapingComponent,
  ],
  exports: [
    SharedScrapingComponent
  ]
})

export class SharedScrapingModule { }
