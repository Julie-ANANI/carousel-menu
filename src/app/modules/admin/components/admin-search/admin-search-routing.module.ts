import { Routes } from '@angular/router';

import { AdminSearchProsComponent } from './admin-search-pros/admin-search-pros.component';
import { AdminSearchMailComponent } from './admin-search-mail/admin-search-mail.component';
import { AdminSearchHistoryComponent } from './admin-search-history/admin-search-history.component';

export const searchRoutes: Routes = [
  { path: '', redirectTo: 'pros', pathMatch: 'full'},
  { path: 'pros', component: AdminSearchProsComponent, pathMatch: 'full' },
  { path: 'mail', component: AdminSearchMailComponent, pathMatch: 'full' },
  { path: 'history', component: AdminSearchHistoryComponent, pathMatch: 'full' }
];
