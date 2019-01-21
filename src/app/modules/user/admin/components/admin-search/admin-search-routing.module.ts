import { Routes } from '@angular/router';
import { RequestResolver } from '../../../../../resolvers/request.resolver';
import { AdminSearchProsComponent } from './admin-search-pros/admin-search-pros.component';
import { AdminSearchMailComponent } from './admin-search-mail/admin-search-mail.component';
import { AdminSearchHistoryComponent } from './admin-search-history/admin-search-history.component';
import { AdminSearchQueueComponent } from './admin-search-queue/admin-search-queue.component';
import { AdminSearchResultsComponent } from './admin-search-results/admin-search-results.component';

export const searchRoutes: Routes = [
  { path: '', redirectTo: 'pros', pathMatch: 'full'},
  { path: 'pros', component: AdminSearchProsComponent, pathMatch: 'full' },
  { path: 'mail', component: AdminSearchMailComponent, pathMatch: 'full' },
  { path: 'history', component: AdminSearchHistoryComponent, pathMatch: 'full' },
  { path: 'queue', component: AdminSearchQueueComponent, pathMatch: 'full' },
  { path: 'results/:requestId', component: AdminSearchResultsComponent, resolve: { request : RequestResolver }, pathMatch: 'full' }
];
