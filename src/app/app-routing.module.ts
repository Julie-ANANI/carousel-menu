import { NgModule } from '@angular/core';
import { ExtraOptions, Routes, RouterModule } from '@angular/router';

import { NonAuthGuard } from './guards/non-auth-guard.service';
import { AuthGuard } from './guards/auth-guard.service';
import { AdHocAuthGuard } from './guards/adhoc-auth-guard.service';
import { NotFoundComponent } from './modules/errors/not-found/not-found.component';
import { demoRoutes } from './modules/demo/demo-routing.module';

const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'user' },
  {
    path: 'user',
    loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule)
  },
  {
    path: 'login',
    canActivate: [NonAuthGuard],
    loadChildren: () => import('./modules/common/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'register',
    canActivate: [NonAuthGuard],
    loadChildren: () => import('./modules/common/signup/signup.module').then(m => m.SignupModule)
  },
  {
    path: 'welcome',
    loadChildren: () => import('./modules/common/welcome/welcome.module').then(m => m.WelcomeModule)
  },
  {
    path: 'discover',
    loadChildren: () => import('./modules/public/discover/discover.module').then(m => m.DiscoverModule)
  },
  {
    path: 'share',
    loadChildren: () => import('./modules/public/share/share.module').then(m => m.ShareModule)
  },
  {
    path: 'sample',
    loadChildren: () => import('./modules/public/share/share.module').then(m => m.ShareModule)
  },
  {
    path: 'demo',
    canActivate: [AuthGuard, AdHocAuthGuard],
    children: [ ...demoRoutes ]
  },
  {
    path: 'logout',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/common/logout/logout.module').then(m => m.LogoutModule)
  },
  {
    path: 'monitoring',
    loadChildren: () => import('./modules/monitoring/monitoring.module').then(m => m.MonitoringModule)
  },
  {
    path: 'not-authorized',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/errors/not-authorized/not-authorized.module').then(m => m.NotAuthorizedModule)
  },
  { path: '**', component: NotFoundComponent },
];

/**
 * Remember: to work perfectly of the QuicklinkStrategy you need to import and export the module 'QuicklinkModule'
 * in the modules if and only that contains the link and its need to <a> tag.
 * More info: npmjs.com/package/ngx-quicklink
 */
const config: ExtraOptions = {
  initialNavigation: 'enabled',
  scrollPositionRestoration: 'top',
  onSameUrlNavigation: 'reload',
  anchorScrolling: 'enabled'
};

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, config)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
