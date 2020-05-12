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
import { FilterService } from '../../public/discover/components/innovations/services/filter.service';

import { PipeModule } from '../../../pipe/pipe.module';
import { SharedLoaderModule } from '../../shared/components/shared-loader/shared-loader.module';
import { TagsService } from '../../../services/tags/tags.service';
import { ModalModule } from '../../utility/modals/modal/modal.module';
import { ErrorTemplate1Module } from '../../utility/errors/error-template-1/error-template-1.module';
import { PaginationTemplate2Module } from '../../utility/paginations/pagination-template-2/pagination-template-2.module';

@NgModule({
  imports: [
    CommonModule,
    DiscoverRoutingModule,
    TranslateModule.forChild(),
    PipeModule,
    SharedLoaderModule,
    ModalModule,
    ErrorTemplate1Module,
    PaginationTemplate2Module
  ],
  providers:[
    ShareService,
    TagsService,
    FilterService
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
