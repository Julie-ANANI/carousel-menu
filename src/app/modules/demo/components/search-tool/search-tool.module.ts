import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { SearchToolRoutingModule } from './search-tool-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SearchToolComponent } from './search-tool.component';
import { SearchService } from '../../../../services/search/search.service';
import { DownloadService } from "../../../../services/download/download.service";

import { CountryFlagModule } from '../../../utility-components/country-flag/country-flag.module';
import { SidebarModule } from "../../../sidebars/templates/sidebar/sidebar.module";
import { SidebarSearchToolModule } from "../../../sidebars/components/sidebar-search-tool/sidebar-search-tool.module";
import { SearchInput3Module } from '../../../utility-components/search-inputs/search-template-3/search-input-3.module';
import { SharedWorldmapModule } from '../../../shared/components/shared-worldmap/shared-worldmap.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    RouterModule,
    SearchToolRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CountryFlagModule,
    SidebarModule,
    SidebarSearchToolModule,
    SearchInput3Module,
    SharedWorldmapModule
  ],
  declarations: [
    SearchToolComponent
  ],
  providers: [
    SearchService,
    DownloadService
  ]
})

export class SearchToolModule {}
