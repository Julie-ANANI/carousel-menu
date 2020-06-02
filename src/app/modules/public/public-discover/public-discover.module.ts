import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PublicDiscoverRoutingModule } from './public-discover-routing.module';

import { PublicDiscoverComponent } from './public-discover.component';
import { PublicDiscoverDescriptionComponent } from './components/public-discover-description/public-discover-description.component';
import { PublicDiscoverInnovationsComponent } from './components/public-discover-innovations/public-discover-innovations.component';
import { FiltersComponent } from './components/public-discover-innovations/components/filters/filters.component';
import { CardsComponent } from './components/public-discover-innovations/components/cards/cards.component';

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

@NgModule({
  imports: [
    CommonModule,
    PublicDiscoverRoutingModule,
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
    PaginationTemplate2Module
  ],
  declarations: [
    PublicDiscoverComponent,
    PublicDiscoverDescriptionComponent,
    PublicDiscoverInnovationsComponent,
    FiltersComponent,
    CardsComponent
  ]
})

export class PublicDiscoverModule {}
