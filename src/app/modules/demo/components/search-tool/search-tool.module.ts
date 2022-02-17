import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { SearchToolRoutingModule } from './search-tool-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SearchToolComponent } from './search-tool.component';

import { SidebarSearchToolModule } from "../../../sidebars/components/sidebar-search-tool/sidebar-search-tool.module";
import { SearchInput3Module } from '../../../utility/search-inputs/search-template-3/search-input-3.module';
import { SharedWorldmapModule } from '../../../shared/components/shared-worldmap/shared-worldmap.module';
import {CountryFlagModule, SidebarFullModule} from '@umius/umi-common-component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    RouterModule,
    SearchToolRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SidebarSearchToolModule,
    SearchInput3Module,
    SharedWorldmapModule,
    CountryFlagModule,
    SidebarFullModule
  ],
  declarations: [
    SearchToolComponent
  ]
})

export class SearchToolModule {}
