import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientComponent } from './client.component';

import { ClientDiscoverComponent } from './components/client-discover/client-discover.component';
import { ClientDiscoverDescriptionComponent } from './components/client-discover-description/client-discover-description.component';

import { ClientMyProjectsComponent } from './components/client-my-projects/client-my-projects.component';
import { ClientProjectNewComponent } from './components/client-project-new/client-project-new.component';

import { ClientLoginComponent } from './components/client-login/client-login.component';
import { ClientLogoutComponent } from './components/client-logout/client-logout.component';
import { ClientSignupComponent } from './components/client-signup/client-signup.component';
import { ClientMyAccountComponent } from './components/client-my-account/client-my-account.component';
import { ClientResetPasswordComponent } from './components/client-reset-password/client-reset-password.component';
import { ClientWelcomeComponent } from './components/client-welcome/client-welcome.component';

/* Shared */
import { SharedNotFoundComponent } from '../shared/components/shared-not-found/shared-not-found.component';
import { SharedMarketReportExampleComponent } from '../shared/components/shared-market-report-example/shared-market-report-example.component';

/* SubModules */
import { clientProjectRoutes } from './components/client-project/client-project-routing.module';

/* Guards */
import { NonAuthGuard } from '../../non-auth-guard.service';
import { AuthGuard } from '../../auth-guard.service';
import { AdminAuthGuard } from '../../admin-auth-guard.service';

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
        path: 'welcome',
        /*canActivate: '',*/
        children: [
          { path: '', component: ClientWelcomeComponent, pathMatch: 'full' }
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
        path: 'reset-password',
        children: [
          { path: ':tokenEmail', component: ClientResetPasswordComponent, pathMatch: 'full' }
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
        canActivate: [AuthGuard],
        children: [
          { path: '', component: ClientDiscoverComponent, pathMatch: 'full' },
          { path: ':id/:lang', component: ClientDiscoverDescriptionComponent, pathMatch: 'full'}
        ]
      },
      {
        path: 'projects',
        children: [
          { path: '', component: ClientMyProjectsComponent, pathMatch: 'full', canActivate: [AuthGuard] },
          { path: 'new', component: ClientProjectNewComponent, pathMatch: 'full', canActivate: [AuthGuard] },
          ...clientProjectRoutes
        ]
      },
      {
        path: 'sample',
        children: [
          { path: '', component: SharedMarketReportExampleComponent, canActivate: [AdminAuthGuard] }
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
