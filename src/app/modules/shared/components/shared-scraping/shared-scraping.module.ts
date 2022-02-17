import { NgModule } from '@angular/core';

import { SharedScrapingComponent } from './shared-scraping.component';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {SharedFilterInputModule} from '../shared-filter-input/shared-filter-input.module';
import {TranslateModule} from '@ngx-translate/core';
import {AutoCompleteInputModule} from '../../../utility/auto-complete-input/auto-complete-input.module';
import {SidebarScrapingModule} from '../../../sidebars/components/sidebar-scraping/sidebar-scraping.module';
import {SidebarFullModule} from '@umius/umi-common-component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    SharedFilterInputModule,
    TranslateModule.forChild(),
    AutoCompleteInputModule,
    SidebarScrapingModule,
    SidebarFullModule
  ],
  declarations: [
    SharedScrapingComponent,
  ],
  exports: [
    SharedScrapingComponent
  ]
})

export class SharedScrapingModule { }
