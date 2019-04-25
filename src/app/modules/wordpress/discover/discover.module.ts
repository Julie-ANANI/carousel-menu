import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DiscoverRoutingModule } from './discover-routing.module';

import { DiscoverComponent } from './discover.component';
import { DiscoverDescriptionComponent } from './components/description/discover-description.component';
import { InnovationsComponent } from './components/innovations/innovations.component';
import { FiltersComponent } from './components/innovations/components/filters/filters.component';
import { CardsComponent } from './components/innovations/components/cards/cards.component';

import { InnovationService } from '../../../services/innovation/innovation.service';
import { ShareService } from '../../../services/share/share.service';
import { UserService } from '../../../services/user/user.service';
import { FilterService } from './components/innovations/services/filter.service';

import { InnovationResolver } from '../../../resolvers/innovation.resolver';

import { PaginationModule } from '../../utility-components/pagination/pagination.module';
import { PipeModule } from '../../../pipe/pipe.module';
import { SharedLoaderModule } from '../../shared/components/shared-loader/shared-loader.module';
import { TagsService } from '../../../services/tags/tags.service';
import { ModalModule } from '../../utility-components/modals/modal/modal.module';

@NgModule({
  imports: [
    CommonModule,
    DiscoverRoutingModule,
    TranslateModule.forChild(),
    PaginationModule,
    PipeModule,
    SharedLoaderModule,
    ModalModule
  ],
  providers:[
    InnovationService,
    InnovationResolver,
    ShareService,
    UserService,
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
