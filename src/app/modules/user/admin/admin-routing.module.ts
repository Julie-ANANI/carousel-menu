import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { AdminProfessionalsComponent } from './components/admin-professionals/admin-professionals.component';
import { AdminProjectComponent } from './components/admin-project/admin-project.component';
import { AdminProjectsComponent } from './components/admin-projects/admin-projects.component';
import { AdminPatentsComponent } from './components/admin-patents/admin-patents.component';
import { AdminSearchComponent } from './components/admin-search/admin-search.component';
import { AdminMonitoringComponent } from './components/admin-monitoring/admin-monitoring.component';
import { AdminCampaignComponent } from './components/admin-campaigns/admin-campaign/admin-campaign.component';
import { AdminCommunityComponent } from "./components/admin-community/admin-community.component";
import { AdminTagsComponent } from './components/admin-tags/admin-tags.component';
import { AdminLibrariesComponent } from './components/admin-libraries/admin-libraries.component';
import { AdminCommunityMemberComponent } from './components/admin-community/admin-community-members/components/admin-community-member/admin-community-member.component';
import { AdminCommunityProjectComponent } from './components/admin-community/admin-community-projects/component/admin-community-project/admin-community-project.component';
import { AdminSettingsComponent } from './components/admin-settings/admin-settings.component';

import { tagsRoutes } from './components/admin-tags/admin-tags-routing.module';
import { searchRoutes } from './components/admin-search/admin-search-routing.module';
import { monitoringRoutes } from './components/admin-monitoring/admin-monitoring-routing.module';
import { projectRoutes } from './components/admin-project/admin-project-routing.module';
import { librariesRoutes } from './components/admin-libraries/admin-libraries-routing.module';
import { settingsRoutes } from './components/admin-settings/admin-settings-routing.module';
import { communityRoutes } from "./components/admin-community/admin-community-routing.module";
import { campaignRoutes } from './components/admin-campaigns/admin-campaigns-routing.module';

import { CampaignAnswersResolver } from '../../../resolvers/admin/campaign-answers.resolver';
import { AdminAuthGuard } from '../../../guards/admin-auth-guard.service';
import { CampaignResolver } from '../../../resolvers/campaign.resolver';
import { InnovationResolver } from '../../../resolvers/innovation.resolver';
import { ProfessionalResolver } from '../../../resolvers/professional.resolver';
import { TagsSectorResolver } from '../../../resolvers/tags-sector-resolver';
import { ProjectsResolver } from '../../../resolvers/admin/projects-resolver';
import { ProfessionalsResolver } from '../../../resolvers/admin/professionals-resolver';
import { UsersResolver } from '../../../resolvers/admin/users-resolver';
import { CampaignProfessionalsResolver } from '../../../resolvers/admin/campaign-professionals-resolver';
import { ProjectTagsPoolResolver } from '../../../resolvers/admin/project-tags-pool-resolver';

const adminRoutes: Routes = [
  {
    path: '',
    canActivate: [AdminAuthGuard],
    children: [
      {
        path: '',
        component: AdminDashboardComponent,
        pathMatch: 'full'
      },
      {
        path: 'users',
        children: [
          {
            path: '',
            component: AdminUsersComponent,
            pathMatch: 'full',
            resolve: { users : UsersResolver },
            runGuardsAndResolvers: 'always',
          },
        ]
      },
      {
        path: 'professionals',
        children: [
          {
            path: '',
            component: AdminProfessionalsComponent,
            pathMatch: 'full',
            resolve: { professionals : ProfessionalsResolver },
            runGuardsAndResolvers: 'always',
          }
        ]
      },
      {
        path: 'community',
        children: [
          {
            path: '',
            component: AdminCommunityComponent,
            children: [
              ...communityRoutes
            ],
          },
          {
            path: 'members/:memberId',
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
        path: 'projects',
        children: [
          {
            path: '',
            component: AdminProjectsComponent,
            pathMatch: 'full',
            resolve: { projects : ProjectsResolver },
            runGuardsAndResolvers: 'always'
          },
          {
            path: 'project/:projectId',
            resolve: { innovation : InnovationResolver, project_tags_pool: ProjectTagsPoolResolver },
            runGuardsAndResolvers: 'always',
            component: AdminProjectComponent,
            children: [
              ...projectRoutes
            ]}
        ]
      },
      {
        path: 'campaigns/campaign/:campaignId',
        component: AdminCampaignComponent,
        resolve: { campaign : CampaignResolver, campaign_answers: CampaignAnswersResolver, campaign_professionals: CampaignProfessionalsResolver },
        runGuardsAndResolvers: 'pathParamsChange',
        children: [
          ...campaignRoutes
        ]
      },
      {
        path: 'search',
        component: AdminSearchComponent,
        children: [
          ...searchRoutes
        ]
      },
      {
        path: 'monitoring',
        component: AdminMonitoringComponent,
        children: [
          ...monitoringRoutes
        ]
      },
      {
        path: 'libraries',
        component: AdminLibrariesComponent,
        children: [
          ...librariesRoutes
        ]
      },
      {
        path: 'patents',
        children: [
          { path: '', component: AdminPatentsComponent, pathMatch: 'full' }
        ]
      },
      {
        path: 'settings',
        component: AdminSettingsComponent,
        children: [
          { path: '', redirectTo: 'blacklist', pathMatch: 'full' },
          ...settingsRoutes,
        ]
      },
      {
        path: 'tags',
        component: AdminTagsComponent,
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
  ],
  providers: [
    AdminAuthGuard
  ]
})

export class AdminRoutingModule {}
