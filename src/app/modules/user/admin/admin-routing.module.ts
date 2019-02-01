import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { AdminProfessionalsComponent } from './components/admin-professionals/admin-professionals.component';
import { AdminProjectComponent } from './components/admin-project/admin-project.component';
import { AdminProjectsComponent } from './components/admin-projects/admin-projects.component';
import { AdminCampaignsComponent } from './components/admin-campaigns/admin-campaigns.component';
import { AdminIndexComponent } from './components/admin-index/admin-index.component';
import { AdminPatentsComponent } from './components/admin-patents/admin-patents.component';
import { AdminSearchComponent } from './components/admin-search/admin-search.component';
import { AdminMonitoringComponent } from './components/admin-monitoring/admin-monitoring.component';
import { AdminComponent } from './admin.component';
import { AdminAuthGuard } from '../../../guards/admin-auth-guard.service';
import { AdminUserDetailsComponent } from './components/admin-users/admin-user-detail/admin-user-details.component';
import { AdminCampaignComponent } from './components/admin-campaigns/admin-campaign/admin-campaign.component';
import { AdminCampaignMailsComponent } from './components/admin-campaigns/admin-campaign-mails/admin-campaign-mails.component';
import { AdminCampaignTemplatesComponent } from './components/admin-campaigns/admin-campaign-templates/admin-campaign-templates.component';
import { AdminCampaignAnswersComponent } from './components/admin-campaigns/admin-campaign-answers/admin-campaign-answers.component';
import { AdminCampaignDetailsComponent } from './components/admin-campaigns/admin-campaign-details/admin-campaign-details.component';
import { AdminCampaignHistoryComponent } from './components/admin-campaigns/admin-campaign-history/admin-campaign-history.component';
import { AdminCampaignProsComponent } from './components/admin-campaigns/admin-campaign-pros/admin-campaign-pros.component';
import { AdminCampaignSearchComponent } from './components/admin-campaigns/admin-campaign-search/admin-campaign-search.component';
import { AdminCampaignSearchResultsComponent } from './components/admin-campaigns/admin-campaign-search-results/admin-campaign-search-results.component';
import { CampaignResolver } from '../../../resolvers/campaign.resolver';
import { InnovationResolver } from '../../../resolvers/innovation.resolver';
import { RequestResolver } from '../../../resolvers/request.resolver';
// import { AdminPresetComponent } from './components/admin-preset/admin-preset.component';
import { AdminTagsComponent } from './components/admin-tags/admin-tags.component';

import { tagsRoutes } from './components/admin-tags/admin-tags-routing.module';
// import { presetsRoutes } from './components/admin-preset/admin-presets/admin-presets-routing.module';

import { searchRoutes } from './components/admin-search/admin-search-routing.module';
import {monitoringRoutes} from './components/admin-monitoring/admin-monitoring-routing.module';
import { projectRoutes } from './components/admin-project/admin-project-routing.module';
import {AdminLibrariesComponent} from './components/admin-libraries/admin-libraries.component';
import {librariesRoutes} from './components/admin-libraries/admin-libraries-routing.module';
import {AdminSettingsComponent} from './components/admin-settings/admin-settings.component';
import {settingsRoutes} from './components/admin-settings/admin-settings-routing.module';
// import {AdminLibrariesComponent} from "./components/admin-libraries/admin-libraries.component";
// import {librariesRoutes} from "./components/admin-libraries/admin-libraries-routing.module";

const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
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
          { path: '', component: AdminUsersComponent, pathMatch: 'full' },
          { path: 'user/:userId', component: AdminUserDetailsComponent, pathMatch: 'full' }
        ]
      },
      {
        path: 'professionals',
        children: [
          { path: '', component: AdminProfessionalsComponent, pathMatch: 'full' }
        ]
      },
      {
        path: 'projects',
        children: [
          { path: '', component: AdminProjectsComponent, pathMatch: 'full' },
          { path: 'project/:projectId',
            resolve: { innovation : InnovationResolver },
            component: AdminProjectComponent,
            children: [
              ...projectRoutes
            ]}
        ]
      },
      {
        path: 'campaigns',
        children: [
          { path: '', component: AdminCampaignsComponent, pathMatch: 'full' },
          { path: 'campaign/:campaignId', component: AdminCampaignComponent, resolve: { campaign : CampaignResolver }, children: [
            { path: '', redirectTo: 'answers', pathMatch: 'full'},
            { path: 'quiz', component: AdminCampaignDetailsComponent, pathMatch: 'full'},
            { path: 'pros', component: AdminCampaignProsComponent, pathMatch: 'full'},
            { path: 'search', component: AdminCampaignSearchComponent, pathMatch: 'full'},
            { path: 'results/:requestId', component: AdminCampaignSearchResultsComponent, resolve: { request : RequestResolver }, pathMatch: 'full' },
            { path: 'history', component: AdminCampaignHistoryComponent, pathMatch: 'full'},
            { path: 'mails', component: AdminCampaignMailsComponent, pathMatch: 'full'},
            { path: 'templates', component: AdminCampaignTemplatesComponent, pathMatch: 'full'},
            { path: 'answers', component: AdminCampaignAnswersComponent, pathMatch: 'full'}
          ]}
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
        path: 'index',
        children: [
          { path: '', component: AdminIndexComponent, pathMatch: 'full' }
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
