import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { AdminProfessionalsComponent } from './components/admin-professionals/admin-professionals.component';
import { AdminProjectComponent } from './components/admin-project/admin-project.component';
import { AdminProjectsComponent } from './components/admin-projects/admin-projects.component';
import { AdminSearchComponent } from './components/admin-search/admin-search.component';
import { AdminMonitoringComponent } from './components/admin-monitoring/admin-monitoring.component';
import { AdminCampaignComponent } from './components/admin-campaigns/admin-campaign/admin-campaign.component';
import { AdminCommunityComponent } from "./components/admin-community/admin-community.component";
import { AdminTagsComponent } from './components/admin-tags/admin-tags.component';
import { AdminLibrariesComponent } from './components/admin-libraries/admin-libraries.component';
import { AdminCommunityMemberComponent } from './components/admin-community/admin-community-members/components/admin-community-member/admin-community-member.component';
import { AdminCommunityProjectComponent } from './components/admin-community/admin-community-projects/component/admin-community-project/admin-community-project.component';
import { AdminSettingsComponent } from './components/admin-settings/admin-settings.component';
import { AdminProjectStoryboardComponent } from './components/admin-project-storyboard/admin-project-storyboard.component';

import { tagsRoutes } from './components/admin-tags/admin-tags-routing.module';
import { searchRoutes } from './components/admin-search/admin-search-routing.module';
import { monitoringRoutes } from './components/admin-monitoring/admin-monitoring-routing.module';
import { projectRoutes } from './components/admin-project/admin-project-routing.module';
import { librariesRoutes } from './components/admin-libraries/admin-libraries-routing.module';
import { settingsRoutes } from './components/admin-settings/admin-settings-routing.module';
import { communityRoutes } from "./components/admin-community/admin-community-routing.module";
import { campaignRoutes } from './components/admin-campaigns/admin-campaigns-routing.module';

import { AdminAuthGuard } from '../../../guards/admin-auth-guard.service';
import { CampaignResolver } from '../../../resolvers/campaign.resolver';
import { InnovationResolver } from '../../../resolvers/innovation.resolver';
import { ProfessionalResolver } from '../../../resolvers/professional.resolver';
import { TagsSectorResolver } from '../../../resolvers/tags-sector-resolver';

const adminRoutes: Routes = [
  {
    path: '',
    canActivateChild: [AdminAuthGuard],
    children: [
      {
        path: '',
        component: AdminDashboardComponent,
        pathMatch: 'full'
      },
      {
        path: 'users',
        canActivateChild: [AdminAuthGuard],
        children: [
          {
            path: '',
            component: AdminUsersComponent,
            pathMatch: 'full',
          },
        ]
      },
      {
        path: 'professionals',
        canActivateChild: [AdminAuthGuard],
        children: [
          {
            path: '',
            component: AdminProfessionalsComponent,
            pathMatch: 'full',
          }
        ]
      },
      {
        path: 'community',
        children: [
          {
            path: '',
            component: AdminCommunityComponent,
            canActivateChild: [AdminAuthGuard],
            children: [
              ...communityRoutes
            ],
          },
          {
            path: 'members/:memberId',
            canActivateChild: [AdminAuthGuard],
            children: [
              {
                path: '',
                component: AdminCommunityMemberComponent,
                pathMatch: 'full',
                resolve: { professional: ProfessionalResolver, tagsSector: TagsSectorResolver },
                runGuardsAndResolvers: 'always'
              }
            ],
          },
          {
            path: 'projects/:projectId',
            canActivateChild: [AdminAuthGuard],
            children: [
              {
                path: '',
                component: AdminCommunityProjectComponent,
                pathMatch: 'full',
                resolve: { innovation : InnovationResolver },
                runGuardsAndResolvers: 'always',
              }
            ],
          }
        ]
      },
      {
        path: 'projects/project/:projectId/storyboard',
        canActivate: [AdminAuthGuard],
        component: AdminProjectStoryboardComponent,
        pathMatch: 'full'
      },
      {
        path: 'projects',
        canActivateChild: [AdminAuthGuard],
        children: [
          {
            path: '',
            component: AdminProjectsComponent,
            pathMatch: 'full',
          },
          {
            path: 'project/:projectId',
            resolve: { innovation : InnovationResolver },
            runGuardsAndResolvers: 'always',
            component: AdminProjectComponent,
            canActivateChild: [AdminAuthGuard],
            children: [
              ...projectRoutes
            ]}
        ]
      },
      {
        path: 'campaigns/campaign/:campaignId',
        component: AdminCampaignComponent,
        resolve: { campaign : CampaignResolver },
        runGuardsAndResolvers: 'always',
        canActivateChild: [AdminAuthGuard],
        children: [
          ...campaignRoutes
        ]
      },
      {
        path: 'search',
        component: AdminSearchComponent,
        canActivateChild: [AdminAuthGuard],
        children: [
          ...searchRoutes
        ]
      },
      {
        path: 'monitoring',
        component: AdminMonitoringComponent,
        canActivateChild: [AdminAuthGuard],
        children: [
          ...monitoringRoutes
        ]
      },
      {
        path: 'libraries',
        component: AdminLibrariesComponent,
        canActivateChild: [AdminAuthGuard],
        children: [
          ...librariesRoutes
        ]
      },
      {
        path: 'settings',
        component: AdminSettingsComponent,
        canActivateChild: [AdminAuthGuard],
        children: [
          { path: '', redirectTo: 'blacklist', pathMatch: 'full' },
          ...settingsRoutes,
        ]
      },
      {
        path: 'tags',
        component: AdminTagsComponent,
        canActivateChild: [AdminAuthGuard],
        children: [
          ...tagsRoutes
        ]
      },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(adminRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class AdminRoutingModule {}
