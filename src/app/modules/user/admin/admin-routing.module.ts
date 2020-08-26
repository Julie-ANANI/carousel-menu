import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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
import { AdminRoleGuard } from '../../../guards/admin-role-guard.service';

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
        path: 'users',
        component: AdminUsersComponent,
        pathMatch: 'full',
        canActivate: [AdminRoleGuard],
        data: { accessPath: ['users'] },
      },
      {
        path: 'professionals',
        component: AdminProfessionalsComponent,
        pathMatch: 'full',
        canActivate: [AdminRoleGuard],
        data: { accessPath: ['professionals'] },
      },
      {
        path: 'projects/project/:projectId/storyboard',
        component: AdminProjectStoryboardComponent,
        pathMatch: 'full',
        resolve: { innovation : InnovationResolver },
        runGuardsAndResolvers: 'always',
        canActivate: [AdminRoleGuard],
        data: { accessPath: ['projects', 'project', 'storyboard'] },
      },
      {
        path: 'projects',
        canActivateChild: [AdminAuthGuard],
        canActivate: [AdminRoleGuard],
        data: { accessPath: ['projects'] },
        children: [
          { path: '', component: AdminProjectsComponent, pathMatch: 'full' },
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
        canActivate: [AdminRoleGuard],
        data: { accessPath: ['projects', 'project', 'campaigns', 'campaign'] },
        children: [
          ...campaignRoutes
        ]
      },
      {
        path: 'community',
        canActivateChild: [AdminAuthGuard],
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
            component: AdminCommunityMemberComponent,
            resolve: { professional: ProfessionalResolver, tagsSector: TagsSectorResolver },
            runGuardsAndResolvers: 'always'
          },
          {
            path: 'projects/:projectId',
            component: AdminCommunityProjectComponent,
            resolve: { innovation: InnovationResolver },
            runGuardsAndResolvers: 'always',
          }
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
        path: 'search',
        component: AdminSearchComponent,
        canActivateChild: [AdminAuthGuard],
        canActivate: [AdminRoleGuard],
        data: { accessPath: ['search'] },
        children: [
          ...searchRoutes
        ]
      },
      {
        path: 'settings',
        component: AdminSettingsComponent,
        canActivateChild: [AdminAuthGuard],
        canActivate: [AdminRoleGuard],
        data: { accessPath: ['settings'] },
        children: [
          ...settingsRoutes,
        ]
      },
      {
        path: 'libraries',
        component: AdminLibrariesComponent,
        canActivateChild: [AdminAuthGuard],
        canActivate: [AdminRoleGuard],
        data: { accessPath: ['libraries'] },
        children: [
          ...librariesRoutes
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
