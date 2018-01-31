import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { AdminProjectsDetailsComponent } from './components/admin-projects/admin-project-details/admin-project-details.component';
import { AdminProjectsComponent } from './components/admin-projects/admin-projects.component';
import { AdminCampaignsComponent } from './components/admin-campaigns/admin-campaigns.component';
import { AdminEmailsComponent } from './components/admin-emails/admin-emails.component';
import { AdminIndexComponent } from './components/admin-index/admin-index.component';
import { AdminPatentsComponent } from './components/admin-patents/admin-patents.component';
import { AdminSearchComponent } from './components/admin-search/admin-search.component';
import { AdminComponent } from './admin.component';
import { AdminAuthGuard } from './admin-auth-guard.service';
import { AdminBatchInformationComponent } from './components/admin-emails/admin-batch-information/admin-batch-information.component';
import { AdminUserDetailsComponent } from './components/admin-users/admin-user-detail/admin-user-details.component';
import { SharedNotFoundComponent } from '../shared/components/shared-not-found/shared-not-found.component';
import { AdminCampaignComponent } from './components/admin-campaigns/admin-campaign/admin-campaign.component';
import { CampaignResolver } from '../../resolvers/campaign.resolver';
import { InnovationResolver } from '../../resolvers/innovation.resolver';
import { AdminPresetComponent } from './components/admin-preset/admin-preset.component';
import { presetsRoutes } from './components/admin-preset/admin-presets/admin-presets-routing.module';
import { questionsRoutes } from './components/admin-preset/admin-questions/admin-questions-routing.module';
import { sectionsRoutes } from './components/admin-preset/admin-sections/admin-sections-routing.module';

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
        path: 'projects',
        children: [
          { path: '', component: AdminProjectsComponent, pathMatch: 'full' },
          { path: 'project/:projectId', resolve: { innovation : InnovationResolver }, children: [
            { path: '', redirectTo: 'settings', pathMatch: 'full'},
            { path: 'settings', component: AdminProjectsDetailsComponent, pathMatch: 'full'},
            { path: 'cards', component: AdminProjectsDetailsComponent, pathMatch: 'full'},
            { path: 'synthesis', component: AdminProjectsDetailsComponent, pathMatch: 'full'},
            { path: 'campaigns', component: AdminProjectsDetailsComponent, pathMatch: 'full'},
            { path: 'mail_config', component: AdminProjectsDetailsComponent, pathMatch: 'full'}
          ]}
        ]
      },
      {
        path: 'campaigns',
        children: [
          { path: '', component: AdminCampaignsComponent, pathMatch: 'full' },
          { path: 'campaign/:campaignId', resolve: { campaign : CampaignResolver }, children: [
            { path: '', redirectTo: 'answers', pathMatch: 'full'},
            { path: 'details', component: AdminCampaignComponent, pathMatch: 'full'},
            { path: 'pros', component: AdminCampaignComponent, pathMatch: 'full'},
            { path: 'search', component: AdminCampaignComponent, pathMatch: 'full'},
            { path: 'history', component: AdminCampaignComponent, pathMatch: 'full'},
            { path: 'answers', component: AdminCampaignComponent, pathMatch: 'full'}
          ]}
        ]
      },
      {
        path: 'search',
        children: [
          { path: '', component: AdminSearchComponent, pathMatch: 'full' }
        ]
      },
      {
        path: 'emails',
        children: [
          { path: '', component: AdminEmailsComponent, pathMatch: 'full' },
          { path: 'batch/:batchId', component: AdminBatchInformationComponent, pathMatch: 'full' }
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
        path: 'presets',
        component: AdminPresetComponent,
        children: [
          ...presetsRoutes
        ]
      },
      {
        path: 'questions',
        component: AdminPresetComponent,
        children: [
          ...questionsRoutes
        ]
      },
      {
        path: 'sections',
        component: AdminPresetComponent,
        children: [
          ...sectionsRoutes
        ]
      },
      { path: '**', component: SharedNotFoundComponent }
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
