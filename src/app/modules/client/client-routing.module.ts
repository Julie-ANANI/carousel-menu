import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientComponent } from './client.component';
import { ClientDiscoverComponent } from './components/client-discover/client-discover.component';

import { ClientMyProjectsComponent } from './components/client-my-projects/client-my-projects.component';
import { ClientProjectComponent } from './components/client-project/client-project.component';
import { ClientCampaignComponent } from './components/client-campaign/client-campaign.component';
import { ClientUserComponent } from './components/client-user/client-user.component';
import { ClientProjectEditComponent } from './components/client-project-edit/client-project-edit.component';
import { ClientProjectSynthesisComponent } from './components/client-project-synthesis/client-project-synthesis.component';
import { ClientProjectNewComponent } from './components/client-project-new/client-project-new.component';

import { ClientLoginComponent } from './components/layout/client-login/client-login.component';
import { ClientLogoutComponent } from './components/layout/client-logout/client-logout.component';
import { ClientSignupComponent } from './components/layout/client-signup/client-signup.component';
import { ClientMyAccountComponent } from './components/client-my-account/client-my-account.component';

/* Shared */
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
          { path: '', component: ClientMyAccountComponent, pathMatch: 'full' }
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
          { path: 'new', component: ClientProjectNewComponent, pathMatch: 'full' },
          {
            path: ':innovationId',
            children: [
              { path: '',    component: ClientProjectComponent },
              { path: 'edit', component: ClientProjectEditComponent },
              { path: 'synthesis', component: ClientProjectSynthesisComponent } // ?isAdmin=true //TODO comment modifier cette route ?
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
