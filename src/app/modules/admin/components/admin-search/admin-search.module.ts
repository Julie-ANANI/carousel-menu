import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../shared/shared.module';
import { AdminSearchComponent } from './admin-search.component';
import { AdminSearchProsComponent } from './admin-search-pros/admin-search-pros.component';
import { AdminSearchMailComponent } from './admin-search-mail/admin-search-mail.component';
import { AdminSearchHistoryComponent } from './admin-search-history/admin-search-history.component';
import { AdminSearchQueueComponent } from './admin-search-queue/admin-search-queue.component';
import { AdminSearchResultsComponent } from './admin-search-results/admin-search-results.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule.forChild()
  ],
  declarations: [
    AdminSearchComponent,
    AdminSearchProsComponent,
    AdminSearchMailComponent,
    AdminSearchHistoryComponent,
    AdminSearchQueueComponent,
    AdminSearchResultsComponent
  ],
  exports: [
    AdminSearchComponent
  ]
})

export class AdminSearchModule {}
