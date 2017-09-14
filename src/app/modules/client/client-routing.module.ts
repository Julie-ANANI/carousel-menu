import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientComponent } from './client.component';
import { ClientDashboardComponent } from './components/client-dashboard/client-dashboard.component';
import { ClientDiscoverComponent } from './components/client-discover/client-discover.component';

import { ClientInnovationsComponent } from './components/client-innovations/client-innovations.component';
import { ClientInnovationSettingsComponent } from './components/client-innovation-settings/client-innovation-settings.component';

import { ClientLoginComponent } from './components/client-login/client-login.component';
import { ClientLogoutComponent } from './components/client-logout/client-logout.component';
import { ClientSignupComponent } from './components/client-signup/client-signup.component';
import { ClientAccountComponent } from './components/client-account/client-account.component';

/* Shared */
import { SharedInfographicComponent } from '../shared/components/shared-infographic/components/shared-infographic/shared-infographic.component';
import { SharedNotFoundComponent } from '../shared/components/shared-not-found/shared-not-found.component';
import { ClientInnovationComponent } from './components/client-innovation/client-innovation.component';

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
        canActivate: [AuthGuard],
        children: [
          { path: '', component: ClientDashboardComponent, pathMatch: 'full' }
        ]
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
          { path: '', component: ClientInnovationsComponent, pathMatch: 'full' },
          {
            path: ':innovationId',
            children: [
              { path: '',    component: ClientInnovationComponent },
              { path: 'settings', component: ClientInnovationSettingsComponent },
            ]
          }
        ]
      },
      { // TODO remove
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
