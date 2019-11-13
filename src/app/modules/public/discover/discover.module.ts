import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DiscoverRoutingModule } from './discover-routing.module';

import { DiscoverComponent } from './discover.component';
import { DiscoverDescriptionComponent } from './components/description/discover-description.component';
import { InnovationsComponent } from './components/innovations/innovations.component';
import { FiltersComponent } from './components/innovations/components/filters/filters.component';
import { CardsComponent } from './components/innovations/components/cards/cards.component';

import { ShareService } from '../../../services/share/share.service';
import { UserService } from '../../../services/user/user.service';
import { TagsService } from '../../../services/tags/tags.service';
import { FilterService } from './components/innovations/services/filter.service';
import { InnovationFrontService } from '../../../services/innovation/innovation-front.service';

import { InnovationResolver } from '../../../resolvers/innovation.resolver';

import { PipeModule } from '../../../pipe/pipe.module';
import { SharedLoaderModule } from '../../shared/components/shared-loader/shared-loader.module';
import { FooterModule } from '../../common/footer/footer.module';
import { HeaderUnauthModule } from '../../common/header-unauth/header-unauth.module';
import { ModalMediaModule } from '../../utility-components/modals/modal-media/modal-media.module';
import { ModalModule } from '../../utility-components/modals/modal/modal.module';
import { HeaderModule } from '../../common/header/header.module';
import { SearchInput2Module } from '../../utility-components/search-inputs/search-template-2/search-input-2.module';
import { ErrorTemplate1Module } from '../../utility-components/errors/error-template-1/error-template-1.module';
import { PaginationTemplate2Module } from '../../utility-components/paginations/pagination-template-2/pagination-template-2.module';


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
    PaginationTemplate2Module
  ],
  providers:[
    InnovationResolver,
    ShareService,
    UserService,
    TagsService,
    FilterService,
    InnovationFrontService
  ],
  declarations: [
    DiscoverComponent,
    DiscoverDescriptionComponent,
    InnovationsComponent,
    FiltersComponent,
    CardsComponent
  ]
})

export class DiscoverModule {}
