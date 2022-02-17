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
import { FooterModule } from '../../common/footer/footer.module';
import { HeaderUnauthModule } from '../../common/header-unauth/header-unauth.module';
import { HeaderModule } from '../../common/header/header.module';
import { ErrorTemplate1Module } from '../../utility/errors/error-template-1/error-template-1.module';
import {CleanHtmlModule} from '../../../pipe/cleanHtml/cleanHtml.module';
import {LangEntryPipeModule} from '../../../pipe/lang-entry/langEntryPipe.module';
import {ModalModule, PaginationModule, SearchInputModule} from '@umius/umi-common-component';

@NgModule({
  imports: [
    CommonModule,
    DiscoverRoutingModule,
    TranslateModule.forChild(),
    PipeModule,
    FooterModule,
    HeaderUnauthModule,
    HeaderModule,
    ErrorTemplate1Module,
    CleanHtmlModule,
    LangEntryPipeModule,
    ModalModule,
    SearchInputModule,
    PaginationModule
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
