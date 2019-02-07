import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSearchHistoryModule } from '../../../../shared/components/shared-search-history/search-history.module';
import { SharedSearchResultsModule } from '../../../../shared/components/shared-search-results/search-results.module';
import { SharedSearchProsModule } from '../../../../shared/components/shared-search-pros/shared-search-pros.module';
import { AdminSearchComponent } from './admin-search.component';
import { AdminSearchProsComponent } from './admin-search-pros/admin-search-pros.component';
import { AdminSearchMailComponent } from './admin-search-mail/admin-search-mail.component';
import { AdminSearchHistoryComponent } from './admin-search-history/admin-search-history.component';
import { AdminSearchQueueComponent } from './admin-search-queue/admin-search-queue.component';
import { AdminSearchResultsComponent } from './admin-search-results/admin-search-results.component';
import { AdminSearchDemoComponent } from './admin-search-demo/admin-search-demo.component';
import { SharedSearchMailModule } from '../../../../shared/components/shared-search-mail/shared-search-mail.module';
import { SharedWorldmapModule } from '../../../../shared/components/shared-worldmap/shared-worldmap.module';
import { RouterModule } from '@angular/router';


@NgModule({
  imports: [
    CommonModule,
    SharedSearchResultsModule,
    SharedSearchProsModule,
    SharedSearchHistoryModule,
    TranslateModule.forChild(),
    SharedSearchMailModule,
    SharedWorldmapModule,
    RouterModule
  ],
  declarations: [
    AdminSearchComponent,
    AdminSearchProsComponent,
    AdminSearchMailComponent,
    AdminSearchHistoryComponent,
    AdminSearchQueueComponent,
    AdminSearchResultsComponent,
    AdminSearchDemoComponent
  ],
  exports: [
    AdminSearchComponent
  ]
})

export class AdminSearchModule {}
