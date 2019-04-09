import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DiscoverRoutingModule } from './discover-routing.module';
import { DiscoverComponent } from './discover.component';
import { DiscoverDescriptionComponent } from './components/description/discover-description.component';

import { InnovationsComponent } from './components/innovations/innovations.component';

import { InnovationService } from '../../../services/innovation/innovation.service';
import { ShareService } from '../../../services/share/share.service';
import { UserService } from '../../../services/user/user.service';

import { InnovationResolver } from '../../../resolvers/innovation.resolver';

import { PaginationModule } from '../../utility-components/pagination/pagination.module';
import { PipeModule } from '../../../pipe/pipe.module';
import { SharedLoaderModule } from '../../shared/components/shared-loader/shared-loader.module';
import { FooterModule } from '../../common/footer/footer.module';
import { HeaderUnauthModule } from '../../common/header-unauth/header-unauth.module';
import { SearchInputModule } from '../../utility-components/search-input/search-input.module';
import { TagsService } from '../../../services/tags/tags.service';
import { ModalMediaModule } from '../../utility-components/modal-media/modal-media.module';
import { ModalModule } from '../../utility-components/modals/modal/modal.module';
import { HeaderModule } from '../../common/header/header.module';


@NgModule({
  imports: [
    CommonModule,
    DiscoverRoutingModule,
    TranslateModule.forChild(),
    PaginationModule,
    PipeModule,
    SearchInputModule,
    SharedLoaderModule,
    FooterModule,
    HeaderUnauthModule,
    ModalMediaModule,
    ModalModule,
    HeaderModule
  ],
  providers:[
    InnovationService,
    InnovationResolver,
    ShareService,
    UserService,
    TagsService
  ],
  declarations: [
    DiscoverComponent,
    DiscoverDescriptionComponent,
    InnovationsComponent
  ]
})

export class DiscoverModule {}
