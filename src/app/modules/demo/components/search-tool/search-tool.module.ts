import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { SearchToolRoutingModule } from './search-tool-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SearchToolComponent } from './search-tool.component';
import { SearchService } from '../../../../services/search/search.service';
import { CommonService } from '../../../../services/common/common.service';

import { AdminSearchMapModule } from '../../../user/admin/components/admin-search/admin-search-map/admin-search-map.module';
import { CountryFlagModule } from '../../../utility-components/country-flag/country-flag.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    RouterModule,
    SearchToolRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AdminSearchMapModule,
    CountryFlagModule
  ],
  declarations: [
    SearchToolComponent
  ],
  providers: [
    SearchService,
    CommonService
  ]
})

export class SearchToolModule {}
