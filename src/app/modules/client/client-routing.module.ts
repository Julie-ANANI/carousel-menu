import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientComponent } from './client.component';
import { ClientDashboardComponent } from './components/client-dashboard/client-dashboard.component';
import { ClientDiscoverComponent } from './components/client-discover/client-discover.component';

import { ClientInnovationComponent } from './components/client-innovation/client-innovation.component';
import { ClientInnovationNewComponent } from './components/client-innovation-new/client-innovation-new.component';
import { ClientCampaignsComponent } from './components/client-campaigns/client-campaigns.component';

import { ClientLoginComponent } from './components/client-login/client-login.component';
import { ClientLogoutComponent } from './components/client-logout/client-logout.component';
import { ClientSignupComponent } from './components/client-signup/client-signup.component';
import { ClientAccountComponent } from './components/client-account/client-account.component';

/* Shared */
import { SharedInfographicComponent } from '../shared/components/shared-infographic/components/shared-infographic/shared-infographic.component';
import { SharedNotFoundComponent } from '../shared/components/shared-not-found/shared-not-found.component';
import { SharedInnovationCardComponent } from '../shared/components/shared-innovation-card/shared-innovation-card.component';

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
        redirectTo: '/innovations'
        /*canActivate: [AuthGuard],
        children: [
          { path: '', component: ClientDashboardComponent, pathMatch: 'full' }
        ]*/
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
        path: 'discover-and-evaluate',
        /*canActivate: [AuthGuard],
        children: [
        ]*/
        redirectTo: '/innovations'
      },
      {
        path: 'innovations',
        canActivate: [AuthGuard],
        children: [
          { path: '', component: ClientInnovationComponent, pathMatch: 'full' },
          { path: 'new', component: ClientInnovationNewComponent },
          { path: ':innovationId', component: SharedInnovationCardComponent }
        ]
      },
      {
        path: 'campaigns',
        canActivate: [AuthGuard],
        children: [
          { path: '', component: ClientCampaignsComponent, pathMatch: 'full' },
          { path: 'new', component: ClientCampaignsComponent },
          { path: ':campaignId', component: ClientCampaignsComponent }
        ]
      },
      {
        path: 'infographic',
        canActivate: [AuthGuard],
        children: [
          { path: '', component: SharedInfographicComponent, pathMatch: 'full' }
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
    RouterModule.forChild(clientRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ClientRoutingModule {}
