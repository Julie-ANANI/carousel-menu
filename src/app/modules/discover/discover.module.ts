import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DiscoverRoutingModule } from './discover-routing.module';
import { DiscoverComponent } from './discover.component';
import { DiscoverDescriptionComponent } from './components/description/discover-description.component';

import { PaginationModule } from '../input/component/pagination/pagination.module';
import { PipeModule } from '../../pipe/pipe.module';
import { SearchInputModule } from '../input/component/search-input/search-input.module';
import { SharedLoaderModule } from '../shared/components/shared-loader/shared-loader.module';
import { HeaderModule } from '../base/components/header/header.module';
import { FooterModule } from '../base/components/footer/footer.module';

@NgModule({
  imports: [
    CommonModule,
    DiscoverRoutingModule,
    TranslateModule.forChild(),
    PaginationModule,
    PipeModule,
    SearchInputModule,
    SharedLoaderModule,
    HeaderModule,
    FooterModule
  ],
  declarations: [
    DiscoverComponent,
    DiscoverDescriptionComponent
  ]
})

export class DiscoverModule {}
