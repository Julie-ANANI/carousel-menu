import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AdminSearchRoutingModule } from './admin-search-routing.module';
import { SharedSearchHistoryModule } from '../../../../shared/components/shared-search-history/shared-search-history.module';
import { SharedSearchResultsModule } from '../../../../shared/components/shared-search-results/search-results.module';
import { SharedSearchProsModule } from '../../../../shared/components/shared-search-pros/shared-search-pros.module';
import { AdminSearchComponent } from './admin-search.component';
import { AdminSearchProsComponent } from './admin-search-pros/admin-search-pros.component';
import { AdminSearchMailComponent } from './admin-search-mail/admin-search-mail.component';
import { AdminSearchHistoryComponent } from './admin-search-history/admin-search-history.component';
import { AdminSearchQueueComponent } from './admin-search-queue/admin-search-queue.component';
import { AdminSearchResultsComponent } from './admin-search-results/admin-search-results.component';
import { SharedSearchMailModule } from '../../../../shared/components/shared-search-mail/shared-search-mail.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { CountryFlagModule } from "../../../../utility/country-flag/country-flag.module";
import { ModalModule } from "../../../../utility/modals/modal/modal.module";
import { AdminSearchScrapingComponent } from './admin-search-scraping/admin-search-scraping.component';
import {SidebarModule} from '../../../../sidebars/templates/sidebar/sidebar.module';
import {SidebarScrapingModule} from '../../../../sidebars/components/sidebar-scraping/sidebar-scraping.module';
import {SharedScrapingModule} from '../../../../shared/components/shared-scraping/shared-scraping.module';

@NgModule({
  imports: [
    CommonModule,
    SharedSearchResultsModule,
    SharedSearchProsModule,
    SharedSearchHistoryModule,
    TranslateModule.forChild(),
    SharedSearchMailModule,
    FormsModule,
    RouterModule,
    CountryFlagModule,
    ModalModule,
    AdminSearchRoutingModule,
    SidebarModule,
    SidebarScrapingModule,
    SharedScrapingModule
  ],
  declarations: [
    AdminSearchComponent,
    AdminSearchProsComponent,
    AdminSearchMailComponent,
    AdminSearchHistoryComponent,
    AdminSearchQueueComponent,
    AdminSearchResultsComponent,
    AdminSearchScrapingComponent
  ],
  exports: [
    AdminSearchComponent
  ]
})

export class AdminSearchModule {}
