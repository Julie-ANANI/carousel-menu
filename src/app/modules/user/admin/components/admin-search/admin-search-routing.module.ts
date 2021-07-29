import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import { RequestResolver } from '../../../../../resolvers/request.resolver';

import { AdminSearchProsComponent } from './admin-search-pros/admin-search-pros.component';
import { AdminSearchMailComponent } from './admin-search-mail/admin-search-mail.component';
import { AdminSearchHistoryComponent } from './admin-search-history/admin-search-history.component';
import { AdminSearchQueueComponent } from './admin-search-queue/admin-search-queue.component';
import { AdminSearchResultsComponent } from './admin-search-results/admin-search-results.component';
import { AdminSearchComponent } from './admin-search.component';

import { AdminRoleGuard } from '../../../../../guards/admin-role-guard.service';
import {AdminSearchScrapingComponent} from './admin-search-scraping/admin-search-scraping.component';

export const routes: Routes = [
  {
    path: '',
    component: AdminSearchComponent,
    children: [
      {
        path: 'pros',
        component: AdminSearchProsComponent,
        pathMatch: 'full',
        canActivate: [AdminRoleGuard],
        data: { accessPath: ['search', 'pros'] }
      },
      { path: 'mail', component: AdminSearchMailComponent, pathMatch: 'full' },
      {
        path: 'history',
        component: AdminSearchHistoryComponent,
        pathMatch: 'full',
        canActivate: [AdminRoleGuard],
        data: { accessPath: ['search', 'history'] }
      },
      {
        path: 'queue',
        component: AdminSearchQueueComponent,
        pathMatch: 'full',
        canActivate: [AdminRoleGuard],
        data: { accessPath: ['search', 'queue'] }
      },
      {
        path: 'results/:requestId',
        component: AdminSearchResultsComponent,
        resolve: { request : RequestResolver },
        runGuardsAndResolvers: 'always',
        pathMatch: 'full'
      },
      {
        path: 'scraping',
        component: AdminSearchScrapingComponent,
        pathMatch: 'full',
        canActivate: [AdminRoleGuard],
        data: { accessPath: ['search', 'scraping'] }
      },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class AdminSearchRoutingModule {}
