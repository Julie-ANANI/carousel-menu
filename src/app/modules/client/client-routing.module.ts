import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* Shared */
import { SharedNotFoundComponent } from '../shared/components/shared-not-found/shared-not-found.component';
import { SharedMarketReportExampleComponent } from '../shared/components/shared-market-report-example/shared-market-report-example.component';

/* SubModules */
import { clientProjectRoutes } from './components/client-project/client-project-routing.module';

/* Guards */
import { AuthGuard } from '../../auth-guard.service';
import { NonAuthGuard } from '../../non-auth-guard.service';

/* Components */
import { ClientComponent } from './client.component';
import { ClientMyAccountComponent } from './components/client-my-account/client-my-account.component';
import { ClientResetPasswordComponent } from './components/client-reset-password/client-reset-password.component';
import { ClientWelcomeComponent } from './components/client-welcome/client-welcome.component';
import { ClientDiscoverPageComponent } from './components/client-discover-page/client-discover-page.component';
import { DiscoverDescriptionComponent } from './components/client-discover-page/discover-description/discover-description.component';
import { LoginPageComponent } from '../base/component/login-page/login-page.component';
import { LogoutPageComponent } from '../base/component/logout-page/logout-page.component';
import { ForgetPasswordPageComponent } from '../base/component/forget-password-page/forget-password-page.component';
import { SignupPageComponent } from '../base/component/signup-page/signup-page.component';

const clientRoutes: Routes = [
  {
    path: '',
    component: ClientComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/project'
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
          { path: '', component: LoginPageComponent, pathMatch: 'full' }
        ]
      },
      {
        path: 'logout',
        canActivate: [AuthGuard],
        children: [
          { path: '', component: LogoutPageComponent, pathMatch: 'full' }
        ]
      },
      {
        path: 'signup',
        canActivate: [NonAuthGuard],
        children: [
          { path: '', component: SignupPageComponent, pathMatch: 'full' }
        ]
      },
      {
        path: 'forget',
        canActivate: [NonAuthGuard],
        children: [
          { path: '', component: ForgetPasswordPageComponent, pathMatch: 'full' }
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
          { path: '', component: ClientDiscoverPageComponent, pathMatch: 'full' },
          { path: ':id/:lang', component: DiscoverDescriptionComponent, pathMatch: 'full'}
        ]
      },
      {
        path: 'sample',
        children: [
          { path: '', component: SharedMarketReportExampleComponent }
        ]
      },
      ...clientProjectRoutes,
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
