import { Routes } from '@angular/router';

import { RequestResolver } from '../../../../../resolvers/request.resolver';

import { AdminCampaignProsComponent } from './admin-campaign-pros/admin-campaign-pros.component';
import { AdminCampaignSearchComponent } from './admin-campaign-search/admin-campaign-search.component';
import { AdminCampaignSearchResultsComponent } from './admin-campaign-search-results/admin-campaign-search-results.component';
import { AdminCampaignHistoryComponent } from './admin-campaign-history/admin-campaign-history.component';
import { AdminCampaignBatchComponent } from './admin-campaign-batch/admin-campaign-batch.component';
import { AdminCampaignWorkflowsComponent } from './admin-campaign-workflows/admin-campaign-workflows.component';
// import { AdminCampaignAnswersComponent } from './admin-campaign-answers/admin-campaign-answers.component';

import { AdminRoleGuard } from '../../../../../guards/admin-role-guard.service';

export const campaignRoutes: Routes = [
  /*{ path: 'answers', component: AdminCampaignAnswersComponent, pathMatch: 'full' },*/
  {
    path: 'pros',
    component: AdminCampaignProsComponent,
    pathMatch: 'full',
    canActivate: [AdminRoleGuard],
    data: { accessPath: ['projects', 'project', 'campaigns', 'campaign', 'pros'] }
  },
  {
    path: 'search',
    component: AdminCampaignSearchComponent,
    pathMatch: 'full',
    canActivate: [AdminRoleGuard],
    data: { accessPath: ['projects', 'project', 'campaigns', 'campaign', 'search'] }
  },
  {
    path: 'history',
    component: AdminCampaignHistoryComponent,
    pathMatch: 'full',
    canActivate: [AdminRoleGuard],
    data: { accessPath: ['projects', 'project', 'campaigns', 'campaign', 'history'] }
  },
  {
    path: 'batch',
    component: AdminCampaignBatchComponent,
    pathMatch: 'full',
    canActivate: [AdminRoleGuard],
    data: { accessPath: ['projects', 'project', 'campaigns', 'campaign', 'batch'] }
  },
  {
    path: 'workflows',
    component: AdminCampaignWorkflowsComponent,
    pathMatch: 'full',
    canActivate: [AdminRoleGuard],
    data: { accessPath: ['projects', 'project', 'campaigns', 'campaign', 'workflows'] }
  },
  {
    path: 'results/:requestId',
    component: AdminCampaignSearchResultsComponent,
    resolve: { request : RequestResolver },
    runGuardsAndResolvers: 'always',
    pathMatch: 'full'
  },
];
