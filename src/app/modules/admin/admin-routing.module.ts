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
import { AdminSearchesComponent } from './components/admin-searches/admin-searches.component';
import { AdminComponent } from './admin.component';
import { AdminAuthGuard } from './admin-auth-guard.service';
import { AdminBatchInformationComponent } from './components/admin-emails/admin-batch-information/admin-batch-information.component';
import { AdminUserDetailsComponent } from './components/admin-users/admin-user-detail/admin-user-details.component';
import { SharedNotFoundComponent } from '../shared/components/shared-not-found/shared-not-found.component';

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
          { path: 'project/:projectId', component: AdminProjectsDetailsComponent, pathMatch: 'full' }
        ]
      },
      {
        path: 'campaigns',
        children: [
          { path: '', component: AdminCampaignsComponent, pathMatch: 'full' }
        ]
      },
      {
        path: 'searches',
        children: [
          { path: '', component: AdminSearchesComponent, pathMatch: 'full' }
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
        path: '**',
        component: SharedNotFoundComponent
      }
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
