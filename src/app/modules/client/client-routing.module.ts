import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* Shared */
import { SharedMarketReportExampleComponent } from '../shared/components/shared-market-report-example/shared-market-report-example.component';

/* SubModules */
// import { clientProjectRoutes } from '../user/client/components/project/project-routing.module';

/* Guards */
import { AuthGuard } from '../../guards/auth-guard.service';
import { NonAuthGuard } from '../../guards/non-auth-guard.service';
import { PendingChangesGuard } from '../../guards/pending-changes-guard.service';

/* Components */
import { ClientComponent } from './client.component';
import { ClientMyAccountComponent } from './components/client-my-account/client-my-account.component';
import { ClientResetPasswordComponent } from './components/client-reset-password/client-reset-password.component';
import { WelcomeComponent } from '../common/welcome/welcome.component';
import { LogoutComponent } from '../common/logout/logout.component';
import { ForgetPasswordComponent } from '../common/login/components/forget-password/forget-password.component';
import { SynthesisListComponent } from './components/synthesis-list/synthesis-list.component';
import { SynthesisCompleteComponent } from '../share/component/synthesis-complete/synthesis-complete.component';

const clientRoutes: Routes = [
  {
    path: '',
    component: ClientComponent,
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        pathMatch: 'full',
        redirectTo: '/projects-list'
      },
      {
        path: 'welcome',
        children: [
          { path: '', component: WelcomeComponent, pathMatch: 'full' }
        ]
      },
      /*{
        path: 'login',
        canActivate: [NonAuthGuard],
        children: [
          { path: '', component: LoginPageComponent, pathMatch: 'full' }
        ]
      },*/
      {
        path: 'logout',
        canActivate: [AuthGuard],
        children: [
          { path: '', component: LogoutComponent, pathMatch: 'full' }
        ]
      },
      {
        path: 'forget',
        canActivate: [NonAuthGuard],
        children: [
          { path: '', component: ForgetPasswordComponent, pathMatch: 'full' }
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
        path: 'synthesis',
        children: [
          { path: '', component: SynthesisListComponent, pathMatch: 'full', canActivate: [AuthGuard] },
          { path: ':projectId/:shareKey', component: SynthesisCompleteComponent, pathMatch: 'full', canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'sample',
        children: [
          { path: '', component: SharedMarketReportExampleComponent }
        ]
      },
      // ...clientProjectRoutes,
      /*{
        path: '**',
        component: NotFoundPageComponent
      }*/
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(clientRoutes)
  ],
  providers: [
    PendingChangesGuard
  ],
  exports: [
    RouterModule
  ]
})

export class ClientRoutingModule {}
