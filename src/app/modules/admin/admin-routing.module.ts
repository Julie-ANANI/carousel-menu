import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { AdminProjectsDetailsComponent } from './components/admin-projects/admin-project-details/admin-project-details.component';
import { AdminProjectsComponent } from './components/admin-projects/admin-projects.component';
import { AdminCampaignsComponent } from './components/admin-campaigns/admin-campaigns.component';
import { AdminIndexComponent } from './components/admin-index/admin-index.component';
import { AdminPatentsComponent } from './components/admin-patents/admin-patents.component';
import { AdminSearchComponent } from './components/admin-search/admin-search.component';
import { AdminEmailsComponent } from './components/admin-emails/admin-emails.component';
import { AdminComponent } from './admin.component';
import { AdminAuthGuard } from '../../admin-auth-guard.service';
import { AdminUserDetailsComponent } from './components/admin-users/admin-user-detail/admin-user-details.component';
import { SharedNotFoundComponent } from '../shared/components/shared-not-found/shared-not-found.component';
import { AdminCampaignComponent } from './components/admin-campaigns/admin-campaign/admin-campaign.component';
import { AdminCampaignMailsComponent } from './components/admin-campaigns/admin-campaign-mails/admin-campaign-mails.component';
import { AdminCampaignAnswersComponent } from './components/admin-campaigns/admin-campaign-answers/admin-campaign-answers.component';
import { AdminCampaignDetailsComponent } from './components/admin-campaigns/admin-campaign-details/admin-campaign-details.component';
import { AdminCampaignHistoryComponent } from './components/admin-campaigns/admin-campaign-history/admin-campaign-history.component';
import { AdminCampaignProsComponent } from './components/admin-campaigns/admin-campaign-pros/admin-campaign-pros.component';
import { AdminCampaignSearchComponent } from './components/admin-campaigns/admin-campaign-search/admin-campaign-search.component';
import { AdminCampaignSearchResultsComponent } from './components/admin-campaigns/admin-campaign-search-results/admin-campaign-search-results.component';
import { CampaignResolver } from '../../resolvers/campaign.resolver';
import { InnovationResolver } from '../../resolvers/innovation.resolver';
import { RequestResolver } from '../../resolvers/request.resolver';
import { AdminPresetComponent } from './components/admin-preset/admin-preset.component';
import { presetsRoutes } from './components/admin-preset/admin-presets/admin-presets-routing.module';
import { questionsRoutes } from './components/admin-preset/admin-questions/admin-questions-routing.module';
import { sectionsRoutes } from './components/admin-preset/admin-sections/admin-sections-routing.module';
import { searchRoutes } from './components/admin-search/admin-search-routing.module';
import { emailsRoutes } from './components/admin-emails/admin-emails-routing.module';

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
          { path: 'campaign/:campaignId', component: AdminCampaignComponent, resolve: { campaign : CampaignResolver }, children: [
            { path: '', redirectTo: 'answers', pathMatch: 'full'},
            { path: 'details', component: AdminCampaignDetailsComponent, pathMatch: 'full'},
            { path: 'pros', component: AdminCampaignProsComponent, pathMatch: 'full'},
            { path: 'search', component: AdminCampaignSearchComponent, pathMatch: 'full'},
            { path: 'results/:requestId', component: AdminCampaignSearchResultsComponent, resolve: { request : RequestResolver }, pathMatch: 'full' },
            { path: 'history', component: AdminCampaignHistoryComponent, pathMatch: 'full'},
            { path: 'mails', component: AdminCampaignMailsComponent, pathMatch: 'full'},
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
        path: 'emails',
        component: AdminEmailsComponent,
        children: [
          ...emailsRoutes
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
