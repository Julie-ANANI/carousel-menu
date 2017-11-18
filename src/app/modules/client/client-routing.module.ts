import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientComponent } from './client.component';

import { ClientMyProjectsComponent } from './components/client-my-projects/client-my-projects.component';
import { ClientProjectComponent } from './components/client-project/client-project.component';
import { ClientCampaignComponent } from './components/client-campaign/client-campaign.component';
import { ClientProjectEditComponent } from './components/client-project-edit/client-project-edit.component';
import { ClientProjectEditExample1Component } from './components/client-project-edit/client-project-edit-example1/client-project-edit-example1.component';
import { ClientProjectEditExample2Component } from './components/client-project-edit/client-project-edit-example2/client-project-edit-example2.component';
import { ClientProjectSynthesisComponent } from './components/client-project-synthesis/client-project-synthesis.component';
import { ClientProjectNewComponent } from './components/client-project-new/client-project-new.component';

import { ClientLoginComponent } from './components/client-login/client-login.component';
import { ClientLogoutComponent } from './components/client-logout/client-logout.component';
import { ClientSignupComponent } from './components/client-signup/client-signup.component';
import { ClientMyAccountComponent } from './components/client-my-account/client-my-account.component';
import { ClientMyUsersComponent } from './components/client-my-users/client-my-users.component';

/* Shared */
import { SharedNotFoundComponent } from '../shared/components/shared-not-found/shared-not-found.component';

/* Guards */
import { NonAuthGuard } from '../../non-auth-guard.service';
import { AuthGuard } from '../../auth-guard.service';
import { PendingChangesGuard } from '../../pending-changes-guard.service';

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
        path: 'users',
        canActivate: [AuthGuard],
        children: [
          { path: '', component: ClientMyUsersComponent, pathMatch: 'full' },
        ]
      },
      {
        path: 'projects',
        children: [
          { path: '', component: ClientMyProjectsComponent, pathMatch: 'full', canActivate: [AuthGuard] },
          { path: 'new', component: ClientProjectNewComponent, pathMatch: 'full', canActivate: [AuthGuard] },
          {
            path: ':innovationId',
            children: [
              { path: '',    component: ClientProjectComponent },
              { path: 'edit', component: ClientProjectEditComponent, canActivate: [AuthGuard], canDeactivate: [PendingChangesGuard] },
              { path: 'synthesis', component: ClientProjectSynthesisComponent, canActivate: [AuthGuard] } // ?isAdmin=true //TODO comment modifier cette route ?
            ]
          },
          {
            path: 'example',
            children: [
              { path: '1',    component: ClientProjectEditExample1Component },
              { path: '2', component: ClientProjectEditExample2Component }
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
