import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DiscoverRoutingModule } from './discover-routing.module';

import { DiscoverComponent } from './discover.component';
import { DiscoverDescriptionComponent } from './components/discover-description/discover-description.component';
import { DiscoverInnovationsComponent } from './components/discover-innovations/discover-innovations.component';
import { FiltersComponent } from './components/discover-innovations/components/filters/filters.component';
import { CardsComponent } from './components/discover-innovations/components/cards/cards.component';

import { PipeModule } from '../../../pipe/pipe.module';
import { SharedLoaderModule } from '../../shared/components/shared-loader/shared-loader.module';
import { FooterModule } from '../../common/footer/footer.module';
import { HeaderUnauthModule } from '../../common/header-unauth/header-unauth.module';
import { ModalMediaModule } from '../../utility/modals/modal-media/modal-media.module';
import { ModalModule } from '../../utility/modals/modal/modal.module';
import { HeaderModule } from '../../common/header/header.module';
import { SearchInput2Module } from '../../utility/search-inputs/search-template-2/search-input-2.module';
import { ErrorTemplate1Module } from '../../utility/errors/error-template-1/error-template-1.module';
import { PaginationTemplate2Module } from '../../utility/paginations/pagination-template-2/pagination-template-2.module';
import {CleanHtmlModule} from '../../../pipe/cleanHtml/cleanHtml.module';

@NgModule({
  imports: [
    CommonModule,
    DiscoverRoutingModule,
    TranslateModule.forChild(),
    PipeModule,
    SharedLoaderModule,
    FooterModule,
    HeaderUnauthModule,
    ModalMediaModule,
    ModalModule,
    HeaderModule,
    SearchInput2Module,
    ErrorTemplate1Module,
    PaginationTemplate2Module,
    CleanHtmlModule
  ],
  declarations: [
    DiscoverComponent,
    DiscoverDescriptionComponent,
    DiscoverInnovationsComponent,
    FiltersComponent,
    CardsComponent
  ]
})

export class DiscoverModule {}
