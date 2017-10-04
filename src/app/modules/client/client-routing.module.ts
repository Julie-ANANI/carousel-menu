import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientComponent } from './client.component';
import { ClientDiscoverComponent } from './components/client-discover/client-discover.component';

import { ClientMyProjectsComponent } from './components/client-my-projects/client-my-projects.component';
import { ClientProjectComponent } from './components/client-project/client-project.component';
import { ClientCampaignComponent } from './components/client-campaign/client-campaign.component';
import { ClientUserComponent } from './components/client-user/client-user.component';
import { ClientProjectEditComponent } from './components/client-project-edit/client-project-edit.component';
import { ClientNewProjectComponent } from './components/client-new-project/client-new-project.component';

import { ClientLoginComponent } from './components/client-login/client-login.component';
import { ClientLogoutComponent } from './components/client-logout/client-logout.component';
import { ClientSignupComponent } from './components/client-signup/client-signup.component';
import { ClientAccountComponent } from './components/client-account/client-account.component';
import { ClientLegalNoticeComponent } from './components/client-legal-notice/client-legal-notice.component';
import { ClientTermsAndConditionsComponent } from './components/client-terms-and-conditions/client-terms-and-conditions.component';

/* Shared */
// import { SharedInfographicComponent } from '../shared/components/shared-infographic/components/shared-infographic/shared-infographic.component';
import { SharedMarketReportComponent} from '../shared/components/shared-market-report/shared-market-report-module';
import { SharedNotFoundComponent } from '../shared/components/shared-not-found/shared-not-found.component';

/* Guards */
import { NonAuthGuard } from '../../non-auth-guard.service';
import { AuthGuard } from '../../auth-guard.service';

const clientRoutes: Routes = [
  {
    path: '',
    component: ClientComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/projects'
      },
      {
        path: 'login',
        canActivate: [NonAuthGuard],
        children: [
          { path: '', component: ClientLoginComponent, pathMatch: 'full' }
        ]
      },
      {
        path: 'logout',
        canActivate: [AuthGuard],
        children: [
          { path: '', component: ClientLogoutComponent, pathMatch: 'full' }
        ]
      },
      {
        path: 'signup',
        canActivate: [NonAuthGuard],
        children: [
          { path: '', component: ClientSignupComponent, pathMatch: 'full' }
        ]
      },
      {
        path: 'account',
        canActivate: [AuthGuard],
        children: [
          { path: '', component: ClientAccountComponent, pathMatch: 'full' }
        ]
      },
      {
        path: 'discover',
        /*canActivate: [AuthGuard],
        children: [
        ]*/
        redirectTo: '/projects'
      },
      {
        path: 'projects',
        canActivate: [AuthGuard],
        children: [
          { path: '', component: ClientMyProjectsComponent, pathMatch: 'full' },
          { path: 'new', component: ClientNewProjectComponent, pathMatch: 'full' },
          {
            path: ':innovationId',
            children: [
              { path: '',    component: ClientProjectComponent },
              { path: 'edit', component: ClientProjectEditComponent },
            ]
          }
        ]
      },
      {
        path: 'campaign',
        canActivate: [AuthGuard],
        children: [
          { path: '', component: ClientCampaignComponent, pathMatch: 'full' }
        ]
      },
      {
        path: 'user',
        canActivate: [AuthGuard],
        children: [
          { path: '', component: ClientUserComponent, pathMatch: 'full' }
        ]
      },
      { // TODO remove
        path: 'infographic',
        canActivate: [AuthGuard],
        children: [
          { path: '', component: SharedMarketReportComponent, pathMatch: 'full' }
        ]
      },
      {
        path: 'terms',
        component: ClientTermsAndConditionsComponent,
        pathMatch: 'full'
      },
      {
        path: 'legal',
        component: ClientLegalNoticeComponent,
        pathMatch: 'full'
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
    RouterModule.forChild(clientRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ClientRoutingModule {}
